/**
 * Веб-компонент "brunov-paste". Открытая схема.
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
     */
    set url( val ) {
        this.setAttribute( 'url', val );
    }
    get url() {
        if ( this.hasAttribute( 'url' ) ) {
            return this.getAttribute( 'url' );
        }
        else return InsertPaginator.DEFAULT_URL;
    }
    static get DEFAULT_URL() {
        return false;
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
        switch( name ) {
            case 'Имя атрибута':
                // Выполняемый код.
                break;
            case 'Имя атрибута':
            // Выполняемый код.
            break;
        }
    }

    /**
     * Браузер вызывает этот метод при добавлении элемента в документ.
     * (может вызываться много раз, если элемент многократно добавляется/удаляется).
     */
    connectedCallback() {
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