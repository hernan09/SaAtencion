import { Component, ViewChild } from '@angular/core'
import { NavController, NavParams, MenuController } from 'ionic-angular'
import { FormGroup, FormControl } from '@angular/forms'
import { Observable } from "rxjs";

import { TycsPage } from '../tycs/tycs'
import { HomePage } from '../home/home'

import { CheckerComponent } from '../../components/checker'

import { AuthService } from '../../providers/auth.service'
import { DataService } from '../../providers/data.service'
import { Utils } from '../../providers/utils'
import { Config } from '../../app/config'
import { NotificationsService } from '../../providers/notifications.service'


@Component({
    selector: 'page-register',
    templateUrl: 'register.html',
})
export class RegisterPage {
    i: any
    p: any
    form: any
    user: any = {}
    preguntas: any = []
    show: string = ''
    last: boolean = false
    hasChosen: boolean = false
    tycs: boolean = false

    telefono

    @ViewChild(CheckerComponent) checker: CheckerComponent

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public auth: AuthService,
        public data: DataService,
        public utils: Utils,
        public notiService: NotificationsService,
        private menu: MenuController
    ) {
        this.telefono = data.getPhoneNumber()
        this.form = new FormGroup({
            "pregs": new FormControl({ value: '', disabled: false })
        })
    }

    ionViewDidEnter() {
        this.menu.swipeEnable(false)
    }

    ionViewWillLeave() {
        this.menu.swipeEnable(true)
    }

    ionViewDidLoad() {
        this.reset()
        this.user.dni = this.navParams.get('dni')
        const pregs = this.navParams.get('data')
        if (pregs && pregs.length) {
            this.preguntas = this.formatQuestions(pregs)
            this.next()
        }
        else {
            this.checker.showError(Config.MSG.ERROR)
        }
    }

    next() {
        if (this.last) {
            this.checkPreguntas()
        }
        else {
            this.p = this.preguntas[this.i++]
            this.last = this.i === this.preguntas.length
            //this.show = i > this.preguntas.length ? 'resumen' : ''
        }
        this.hasChosen = false
    }

    reset() {
        this.i = 0
        this.last = false
        this.tycs = false
        this.show = ''
        this.checker.hide()
    }

    retry() {
        this.reset()
        this.next()
    }

    goToTycs() {
        this.navCtrl.push(TycsPage)
    }

    getValor(p) {
        if (!p || !p.opciones) return ''
        let rta = p.opciones.find(o => o.valor == p.respuesta)
        return rta ? rta.texto : ''
    }

    checkPreguntas() {
        console.log('checkPreguntas:', this.preguntas)
        this.checker.showChecking()
        this.auth.checkPreguntas(this.preguntas)
            .then(
                ok => {
                    this.p = null
                    this.auth.answer(this.user.dni, true).subscribe(
                        data => {

                            //Luego de que se contestaron las preg OK llamamos a OS y a la BE para registrar DNI
                            this.notiService.init(this.navCtrl)
                                .then(data => {
                                    const deviceId = data.userId // oneSignalPlayerID
                                    console.log(`Device ID is [${deviceId}]`)
                                    this.data.registrarDispositivo(deviceId, this.user.dni)
                                        .then(data => {
                                            this.checker.showOk(Config.MSG.REGISTER_OK)
                                            this.auth.login(this.user.dni)
                                            setTimeout(_ => this.navCtrl.setRoot(HomePage), 2000)
                                        })
                                        .catch(err => {
                                            this.checker.showError(Config.MSG.CONNECTION_ERROR)
                                        })
                                })
                                .catch(err => {
                                    console.warn('Could not get device ID:', err)
                                    return Observable.throw("Server error");
                                })

                        },
                        err => {
                            console.log(err)
                            this.checker.showError(Config.MSG.CONNECTION_ERROR)
                        }
                    )
                },
                err => {
                    console.log(err)
                    this.p = null
                    this.auth.answer(this.user.dni, false).subscribe(
                        data => {
                            this.preguntas = this.formatQuestions(data);
                            this.checker.showError(Config.MSG.REGISTER_ERROR_INCORRECT);
                            this.show = 'retry';
                        },
                        err => {
                            var userBloquedMsg = Config.MSG.REGISTER_ERROR_INCORRECT_2.replace('{}',this.data.blockedUserPhoneNumber.number);
                            this.checker.showError(userBloquedMsg);
                            this.show = 'callus';
                        }
                    )
                }
            )
    }

    formatQuestions(questions) {
        return questions.map(q => {
            let correcta
            let opciones = []
            q.respuestas.forEach((r, i) => {
                opciones.push({
                    texto: r.respuesta,
                    valor: i
                })
                if (this.utils.isTrue(r.valida)) correcta = i
            })
            return {
                texto: q.pregunta,
                opciones,
                correcta,
                respuesta: null
            }
        })
    }
   
    getBlockUserPhoneNumber(index:number){
        this.telefono = this.data.getBlockUserPhoneNumber();
    }

}
