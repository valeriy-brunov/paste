/**
 * Импортируем основные библиотеки для тестирования.
 */
import '/cms/webcomponent/js/testlibs/mocha.js';
import '/cms/webcomponent/js/testlibs/chai.js';
import '/cms/webcomponent/js/testlibs/sinon.js';

/**
 * Импортируем основные файлы веб-компонента для тестирования.
 */
import Paste from './paste.js';

// Для именованных классов необходимо создать объект.
var paste = new Paste();

/**
 * Настраиваем библиотеки для тестирования.
 */
mocha.setup( 'bdd' );
var assert = chai.assert;
var expect = chai.expect;

/**
 * Тесты.
 */
describe("Тест вэб-компонента Paste.", function() {

    const testId = document.getElementById( 'test' );

    /**
     * Создаёт и вставляет вёрстку веб-компонента "Paste".
     * 
     * @param {string} firstLoad Вид загрузки, который необходимо применить при первоначальной загрузке страницы.
     * @param {string} nextLoad Вид загрузки, который необходимо применить при изменение атрибута `url`.
     * @return void
     */
    function createPaste(  firstLoad, nextLoad = '' ) {
        let template = document.createElement( 'template' );
        template.innerHTML = `
            <brunov-paste firstload="${firstLoad}" nextLoad="${nextLoad}" url="#" class="paste">
                <div class="paste__replace"></div>
            </brunov-paste>`;
        testId.appendChild( template.content );
    };

    /**
     * Группа тестов.
     */
    describe("Установка классов стилей веб-компонента при первоначальной загрузке:", function() {

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

        function firstLoad( typeLoad, classPaste ) {
            
            beforeEach(() => {});
            
            it(`Для "firstLoad"="${typeLoad}" проверим установку класса "paste_${classPaste}".`, function() {
                createPaste( typeLoad );
                let p = testId.querySelector( '.paste' );
                assert.equal( p.classList.contains( 'paste_' + classPaste ), true, 'Класс "paste_' + classPaste + '" не установлен!' );
            });

            afterEach(() => testId.innerHTML = '');
        }

        let typeLoad = ['html', 'loader', 'progress', 'progress-loader'];
        let classPaste = ['replace', 'trubber', 'replace', 'trubber'];
        for (let i = 0; i < typeLoad.length; i++) {
            firstLoad( typeLoad[i], classPaste[i] );
        }
    });

    /**
     * Группа тестов.
     */
    describe("Проверка работы AJAX-запроса:", function () {

        function ajaxQuery( firstLoad, nextLoad, text ) {

            beforeEach( () => {
                createPaste( firstLoad, nextLoad );
                sinon.stub( paste, 'query' ).callsFake( paste.replaceDiv( text, testId.querySelector( '.paste' )));
            });

            it(`Для "firstLoad"="${firstLoad}" и "nextLoad"="${nextLoad}"`, function() {
                let paste = testId.querySelector( '.paste' );
                let style = paste.querySelector( 'style' );
                style.remove();
                assert.equal( paste.textContent.trim(), text, `Для "firstLoad"="${firstLoad}" и "nextLoad"="${nextLoad}" AJAX-запрос сработал с ошибкой!`);
            });

            afterEach( () => {
                testId.innerHTML = '';
                sinon.restore();
            });
        }

        ajaxQuery( 'loader', 'loader', 'tttt222222' );
    });
});

/**
 * Запуск тестов.
 */
mocha.run();