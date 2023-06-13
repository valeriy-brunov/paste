/**
 * Веб-компонент "Paste". Открытая схема.
 */

import Template from './template.js';
import Ajax from './ajax.js';

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
     * 
     * @param {string} val
     * @return void
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
     * 
     * @param {string} val
     * @return void
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
     * 
     * @param {string} val
     * @return void
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
     * 
     * @param {string} val
     * @return void
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
     * 
     * @param {string} val Имя класса: "replace" или "trubber".
     * @return void
     */
    addClassRt( val ) {
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
     * Добавляет или удаляет класс "paste_progress".
     * 
     * @param {bool} val true - установить класс "paste_progress" или false - удалить класс "paste_progress".
     * @return void
     */
    addClassP( val ) {
        if ( val ) {
            if ( !this.classList.contains( 'paste_progress' ) ) {
                this.classList.add( 'paste_progress' );
            }
        }
        else {
            if ( this.classList.contains( 'paste_progress' ) ) {
                this.classList.remove( 'paste_progress' );
            }
        }
    }

    /**
     * Определяем, за какими атрибутами необходимо наблюдать.
     * 
     * @return array Массив атрибутов.
     */
    static get observedAttributes() {
        return ['url'];
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
        if ( oldVal ) {
            switch ( name ) {
                case 'url':// Для атрибута 'url'.
                    if ( this.nextLoad == 'html' ) {
                        this.addClassRt( 'replace' );
                        this.query();
                    }
                    else {
                        this.modeLoad( this.nextLoad );
                    }
                    break;
                case 'nextLoad':// Для атрибута 'nextLoad'.
                    break;
            }
        }
    }

    /**
     * Браузер вызывает этот метод при добавлении элемента в документ.
     * (может вызываться много раз, если элемент многократно добавляется/удаляется).
     */
    connectedCallback() {
        this.modeLoad( this.firstLoad );
        // СОБЫТИЯ:
        // this.dom.valera.addEventListener('click', (e) => console.log(e.currentTarget));// Для примера.

    }

    /**
     * В зависимости от полученного значения вида режима выполняет определённые действия.
     * 
     * @param {string} mode Вид режима загрузки.
     * @return void
     */
    modeLoad( mode ) {
        this.addClassP( false );
        switch( mode ) {
            case 'loader':
                this.addClassRt( 'trubber' );
                this.query();
                break;
            case 'progress':
                this.addClassP( true );
                this.queryP();
                break;
            case 'progress-loader':
                this.addClassRt( 'trubber' );
                break;
            case 'html':
                this.addClassRt( 'replace' );
        }
    }

    /**
     * Запуск прогресс-бара.
     * 
     * @return void
     */
    startProgress() {
        this.barStandartProgress = 0;
        this.barSpeedProgress = 0;
        this.currentProgress = 0;
        this.limit = 0;
        this.totalLoad = 0;
        this.load = 0;
        this.standartProgress();
        this.limitSpeedProgress();
    }

    /**
     * Двигает прогресс-бар на нужную величину.
     * 
     * @return void
     */
    moveProgress() {
        this.currentProgress = Math.max( this.barStandartProgress, this.barSpeedProgress );
        this.dom.tagProgress.setAttribute( 'style', `width:${this.currentProgress}%` );
    }

    /**
     * Двигает прогресс-бар со стандартной скоростью.
     * 
     * @return void
     */
    standartProgress() {
        this.barStandartProgress++;
        this.moveProgress();
        if ( this.currentProgress < 100 ) setTimeout( this.standartProgress, 100 );
    }

    /**
     * Двигает прогресс-бар до значений 'limit' с повышенной скоростью.
     * 
     * @return void
     */
    limitSpeedProgress() {
        if ( this.limit > this.barSpeedProgress ) {
            this.barSpeedProgress++;
            this.moveProgress();
        }
        if ( this.currentProgress < 100 ) setTimeout( this.limitSpeedProgress, 20 );
    }

    /**
     * Производит очередной расчёт предела загрузки прогресс-бара.
     * 
     * @return void
     */
    calculatingLimit() {
        if ( this.totalLoad == this.load ) {
            this.limit = 100;
        }
        else {
            this.limit = 50 + (Math.round( (100 - 50)/this.totalLoad ) * this.load);
        }
    }

    /**
     * Переносит теги "<script>" в шапку страницы (формирует их вновь из js-кода), удаляет теги "<script>"
     * в переданной переменной "html".
     * 
     * @param  {string} html Код-html, полученный от AJAX-запроса.
     * @return {string} Код-html без тегов "<script>".
     */
    moveTagsScript( html ) {
        let arrHtml = html.split( '</script>' );
        if( arrHtml.length == 1 ) return html;
        let i = 0, scripts = [], head = document.getElementsByTagName('head')[0];
        while( i < arrHtml.length - 1 ) {
            let url = arrHtml[i].match(/[\/(\w|\-)+]+\.js/ig);
            let result = url[0].match(/\/(?<name>[\w|\-]+)\.js$/i);
            let nameWebComp = result.groups.name;
            if( !customElements.get( 'brunov-' + nameWebComp ) ) {
                scripts[i] = document.createElement('script');
                scripts[i].src = url;
                scripts[i].type = 'module';
                scripts[i].setAttribute('onload', this.id + ".setAttribute('total-load', " + this.id + ".getAttribute('total-load')-1);");
                head.append( scripts[i] );
                this.totalLoad++;
            }
            i++;
        }
        return arrHtml[ arrHtml.length - 1 ];
    }

    /**
     * AJAX-запрос на сервер для режимов "loader" и "html".
     * 
     * @return void
     */
    query() {
        if ( this.url == '#' ) return;
        let self = this;
        Ajax.connect({
            url: self.url,
            success: function( html ) {
                self.replaceDiv( html );
            },
            error: function( status, statusText ) {},
            errorConnect: function() {},
        });
    }

    /**
     * AJAX-запрос на сервер для режима "progress".
     * 
     * @return void
     */
    queryP() {
        if ( this.url == '#' ) return;
        let self = this;
        Ajax.connect({
            url: self.url,
            beforeSend: function() {
                this.startProgress();
            },
            success: function( html ) {
                this.limit = 50;
                // Подсчёт количества загрузок.
                self.replaceDiv( html );
            },
            error: function( status, statusText ) {},
            errorConnect: function() {},
        });
    }

    /**
     * Заменяет тег с классом "paste__replace" на код html.
     * 
     * @param {string} html Html-код, который заменит тег "<div class='paste__replace'>".
     * @param {object} self Объект веб-компонента.
     * @return void
     */
    replaceDiv( html, self = this ) {
        let replace = self.querySelector( '.paste__replace' );
        if ( replace ) {
            replace.remove();
            self.insertAdjacentHTML( 'beforeend', html );
            self.addClassRt( 'replace' );
        }
    };
}

/**
 * Регистрация веб-компонента.
 */
if ( !customElements.get( 'brunov-paste' ) ) {
    customElements.define( 'brunov-paste', Paste );
}
