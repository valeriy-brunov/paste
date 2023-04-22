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

    describe("Установка классов при первоначальной загрузке:", function() {

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
    
        function firstload( typeload, classpaste ) {
            it("Для 'firstLoad=" + typeload + "' проверим установку класса 'paste_" + classpaste + "'.", function() {
                let testDiv = document.getElementById( 'test' );
                testDiv.innerHTML = '<brunov-paste firstload="' + typeload + '" class="paste"></brunov-paste>';
                let p = testDiv.querySelector( '.paste' );
                assert.equal( p.classList.contains( 'paste_' + classpaste ), true, 'Класс "paste_' + classpaste + '" не установлен!' );
                testDiv.innerHTML = '';
            });
        }

        let typeLoad = ['html', 'loader', 'progress', 'progress-loader'];
        let classPaste = ['replace', 'trubber', 'replace', 'trubber'];
        for (let i = 0; i < typeLoad.length; i++) {
            firstload( typeLoad[i], classPaste[i] );
        }
    });

    describe("Проверка работы AJAX-запроса.", function () {

        function ajaxQuery( firstLoad, nextLoad, text ) {

            function createPaste(  firstLoad, nextLoad, text  ) {
                var test = document.getElementById( 'test' );
                test.innerHTML = '';
                let template = document.createElement( 'template' );
                template.innerHTML = `
                    <brunov-paste firstload="${firstLoad}" nextLoad="${nextLoad}" url="#" class="paste">
                        <div class="paste__replace"></div>
                    </brunov-paste>`;
                test.appendChild( template.content );
            };

            beforeEach( () => {
                createPaste(  firstLoad, nextLoad, text );
                sinon.stub( paste, 'query').callsFake( paste.replaceDiv( text, test.querySelector('.paste') ) );
            });

            it(`Для "firstLoad"="${firstLoad}" и "nextLoad"="${nextLoad}"`, function() {
                let paste = test.querySelector('.paste');
                let style = paste.querySelector( 'style' );
                style.remove();
                assert.equal( paste.textContent.trim(), text, `Для "firstLoad"="${firstLoad}" и "nextLoad"="${nextLoad}" AJAX-запрос сработал с ошибкой!`);
            });

            afterEach( function() {
                sinon.restore();
            });
        }

        ajaxQuery( 'loader', 'loader', 'tttt222222' );
    });
    /*it("Функция из файла template!", function() {
        assert.equal( Template.mapDomShadow(), 8 );
    });*/
});

/**
 * Запуск тестов.
 */
mocha.run();