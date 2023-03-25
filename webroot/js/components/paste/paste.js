/**
 * Веб-компонент "Paste". Открытая схема.
 */

import Template from './template.js';

/**
 * Класс Paste
 */
export default class Paste extends HTMLElement {

    /**
     * Конструктор.
     */
    constructor() {

        super();
        
        // Кеширование элементов компонента не входящих в теневую модель:
        this.dom = Template.mapDom( this );

        // Подключаем CSS:
        this.insertAdjacentHTML( 'afterbegin', Template.render() );

        // Кешируем значения.
        // this.cashe = this.casheValue();
    }

    /**
     * Кеширование значений или объектов.
     */
    casheValue() {
        return {
            //myVal: 'Значение или объект',
        }
    }

    /**
     * Атрибут "url".
     * @param {string} val
     */
    set url( val ) {
        this.setAttribute( 'url', val );
    }
    get url() {
        if ( this.hasAttribute( 'url' ) ) {
            return this.getAttribute( 'url' );
        }
        else return Paste.DEFAULT_URL;
    }
    static get DEFAULT_URL() {
        return '#';
    }

    /**
     * Атрибут "firstLoad".
     * @param {string} val
     */
    set firstLoad( val ) {
        this.setAttribute( 'firstLoad', val );
    }
    get firstLoad() {
        if ( this.hasAttribute( 'firstLoad' ) ) {
            return this.getAttribute( 'firstLoad' );
        }
        else return Paste.DEFAULT_FIRSTLOAD;
    }
    static get DEFAULT_FIRSTLOAD() {
        return false;
    }

    /**
     * Атрибут "nextLoad".
     * @param {string} val
     */
    set nextLoad( val ) {
        this.setAttribute( 'nextLoad', val );
    }
    get nextLoad() {
        if ( this.hasAttribute( 'nextLoad' ) ) {
            return this.getAttribute( 'nextLoad' );
        }
        else return Paste.DEFAULT_NEXTLOAD;
    }
    static get DEFAULT_NEXTLOAD() {
        return false;
    }

    /**
     * Атрибут "progressId".
     * @param {string} val
     */
    set progressId( val ) {
        this.setAttribute( 'progressId', val );
    }
    get progressId() {
        if ( this.hasAttribute( 'progressId' ) ) {
            return this.getAttribute( 'progressId' );
        }
        else return Paste.DEFAULT_PROGRESSID;
    }
    static get DEFAULT_PROGRESSID() {
        return false;
    }

    /**
     * Добавляет взаимоисключающие классы.
     * @param {string} val Имя класса: "replace" или "trubber".
     */
    addClass( val ) {
        if ( this.classList.contains( 'paste_replace' ) ) {
            this.classList.remove( 'paste_replace' );
        }
        if ( this.classList.contains( 'paste_trubber' ) ) {
            this.classList.remove( 'paste_trubber' );
        }
        if ( val == 'replace' ) {
            this.classList.add( 'paste_replace' );
        }
        else if ( val == 'trubber' ) {
            this.classList.add( 'paste_trubber' );
        }
    }

    /**
     * Определяем, за какими атрибутами необходимо наблюдать.
     *
     * @return array Массив атрибутов.
     */
    static get observedAttributes() {
        //return ['Имя атрибута'];
    }

    /**
     * Следим за изменениями этих атрибутов и отвечаем соответственно.
     *
     * @param {string} name Имя атрибута, в котором произошли изменения.
     * @param {string} oldVal Старое значение атрибута, т.е. до его изменения.
     * @param {string} newVal Новое значение атрибута.
     * @return void
     *
     * !!! При первой загрузке страницы, если атрибуты установлены в веб-компоненте, происходит
     *     срабатывание данной функции, при этом "oldVal=null", а "newVal" будет равно значению,
     *     установленному в веб-компоненте.
     */
    attributeChangedCallback( name, oldVal, newVal ) {
        // Для атрибута 'url'.
        if ( name == 'url' && oldVal ) {
            switch( name ) {
                case 'Имя атрибута':
                    // Выполняемый код.
                    break;
                case 'Имя атрибута':
                // Выполняемый код.
                break;
            }
        }
        // Для атрибута 'nextLoad'.
        if ( name == 'nextLoad' && oldVal ) {

        }
    }

    /**
     * Браузер вызывает этот метод при добавлении элемента в документ.
     * (может вызываться много раз, если элемент многократно добавляется/удаляется).
     */
    connectedCallback() {
        switch( this.firstLoad ) {
            case 'loader':
                this.addClass( 'trubber' );
                break;
            case 'progress':

                break;
            case 'progress-loader':
                
                break;
            case 'html':
                this.addClass( 'replace' );
        }
        // СОБЫТИЯ:
        // this.dom.valera.addEventListener('click', (e) => console.log(e.currentTarget));// Для примера.

    }
}

/**
 * Регистрация веб-компонента.
 */
if ( !customElements.get( 'brunov-paste' ) ) {
    customElements.define( 'brunov-paste', Paste );
}