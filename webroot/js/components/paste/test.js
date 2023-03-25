/**
 * Импортируем основные библиотеки для тестирования.
 */
import '/cms/webcomponent/js/testlibs/mocha.js';
import '/cms/webcomponent/js/testlibs/chai.js';

/**
 * Импортируем основные файлы веб-компонента для тестирования.
 */
import Paste from './paste.js';
//import Template from './template.js';

// Для именованных классов необходимо создать объект.
var paste = new Paste();

/**
 * Настраиваем библиотеки для тестирования.
 */
mocha.setup( 'bdd' );
var assert = chai.assert;

/**
 * Тесты.
 */
describe("Тест вэб-компонента Paste.", function() {

    it("Проверка на установку класса 'paste_replace'.", function() {
        paste.addClass( 'replace' );
        assert.equal( paste.classList.contains( 'paste_replace' ), true, 'Класс "paste_replace" не установлен!');
        assert.equal( paste.classList.contains( 'paste_trubber' ), false, 'Класс "paste_trubber" не удалён!' );
    });

    it("Проверка на установку класса 'paste_trubber'.", function() {
        paste.addClass( 'trubber' );
        assert.equal( paste.classList.contains( 'paste_trubber' ), true, 'Класс "paste_trubber" не установлен!');
        assert.equal( paste.classList.contains( 'paste_replace' ), false, 'Класс "paste_replace" не удалён!' );
    });

    it("Для 'firstLoad=html' проверим установку класса 'paste_replace'.", function() {
        let testDiv = document.getElementById( 'test' );
        testDiv.innerHTML = '<brunov-paste firstload="html" class="paste"></brunov-paste>';
        let p = testDiv.querySelector( '.paste' );
        assert.equal( p.classList.contains( 'paste_replace' ), true, 'Класс "paste_replace" не установлен!' );
        testDiv.innerHTML = '';
    });

    it("Для 'firstLoad=loader' проверим установку класса 'paste_trubber'.", function() {
        let testDiv = document.getElementById( 'test' );
        testDiv.innerHTML = '<brunov-paste firstload="loader" class="paste"></brunov-paste>';
        let p = testDiv.querySelector( '.paste' );
        assert.equal( p.classList.contains( 'paste_trubber' ), true, 'Класс "paste_trubber" не установлен!' );
        testDiv.innerHTML = '';
    });
    /*it("Функция из файла template!", function() {
        assert.equal( Template.mapDomShadow(), 8 );
    });*/
});

/**
 * Запуск тестов.
 */
mocha.run();