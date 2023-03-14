/**
 * Шаблон для компонента "brunov-paste".
 */
export default {

    render( props ) {
        return `${this.css( props )}`;
    },

    /**
     * Кэширование элементов компонента для теневой модели.
     */
    mapDomShadow( scope ) {
        return {
            //myDiv: scope.querySelector('.ffff'),
        }
    },

    /**
     * Кеширование элементов компонента не входящих в теневую модель.
     */
    mapDom( scope ) {
        return {
            tagTempl: scope.querySelector('.field-simbol-template'),// Тег <template>.
        }
    },

    /**
     * Перемещает стили в компонент.
     */
    css( p ) { return `
        <style>
            :host { color: red; }// Для paste.
        </style>`;
    },
}