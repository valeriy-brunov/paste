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
import Template from './template.js';

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

    describe(`Проверяем установку классов стилей веб-компонента: "paste_replace" и "paste_trubber":`, function() {

        let paste = new Paste();

        it(`Установка класса 'paste_replace'.`, function() {
            paste.addClassRt( 'replace' );
            assert.equal( paste.classList.contains( 'paste_replace' ), true, 'Класс "paste_replace" не установлен!');
            assert.equal( paste.classList.contains( 'paste_trubber' ), false, 'Класс "paste_trubber" не удалён!' );
        });

        it(`Установка класса 'paste_trubber'.`, function() {
            paste.addClassRt( 'trubber' );
            assert.equal( paste.classList.contains( 'paste_trubber' ), true, 'Класс "paste_trubber" не установлен!');
            assert.equal( paste.classList.contains( 'paste_replace' ), false, 'Класс "paste_replace" не удалён!' );
        });

        it(`Установка  и удаление класса 'paste_progress'.`, function() {
            paste.addClassP( true );
            assert.equal( paste.classList.contains( 'paste_progress' ), true, 'Класс "paste_progress" не установлен!' );
            paste.addClassP( false );
            assert.equal( paste.classList.contains( 'paste_progress' ), false, 'Класс ""pate_progress не удален!' );
        });

        afterEach(() => {
            paste.classList.remove( 'paste_trubber' );
            paste.classList.remove( 'paste_replace' );
        });
    });

    describe(`Проверяем установку классов стилей веб-компонента: "paste_replace" и "paste_trubber" в зависимости от установки значений атрибута "firstLoad":`, function() {

        function firstLoad( typeLoad, classPaste ) {

            let paste = new Paste();

            beforeEach(() => {
                paste.setAttribute( 'firstLoad', typeLoad );
                paste.setAttribute( 'class', 'paste' );
            });

            it(`Для атрибута "firstLoad"="${typeLoad}" проверим установку класса "paste_${classPaste}".`, function() {
                paste.connectedCallback();
                assert.equal( paste.classList.contains( 'paste_' + classPaste ), true, 'Класс "paste_' + classPaste + '" не установлен!' );
            });

            afterEach(() => {});
        }

        let typeLoad = ['html', 'loader', 'progress', 'progress-loader'];
        let classPaste = ['replace', 'trubber', 'progress', 'trubber'];
        for (let i = 0; i < typeLoad.length; i++) {
            firstLoad( typeLoad[i], classPaste[i] );
        }
    });

    describe(`Проверка работы AJAX-запроса:`, function() {

        var textReplace = '';
        function newTextReplace() {
            textReplace = `replace-text-number-` + Math.floor( Math.random() * 100000 );
        }

        let paste = new Paste();
        let sinonFun = sinon.stub( paste, 'query' );
        let mode = ['html', 'loader'];

        paste.setAttribute( 'class', 'paste' );
        newTextReplace();
        paste.insertAdjacentHTML( 'beforeend', `<div class="paste__replace">${textReplace}</div>` );
        paste.setAttribute( 'url', '#' );

        function ajaxQuery( firstLoad, nextLoad ) {

            it(`Для атрибута "firstLoad"="${firstLoad}" и "nextLoad"="${nextLoad}"`, () => {

                /**
                 * Проверка на содержание текста внутри тегов с классом "paste__replace".
                 */
                function check() {
                    let replace = paste.querySelector( '.paste__replace' );
                    assert.equal( replace.textContent.trim() == textReplace, true, 'AJAX-запрос сработал не верно!' );
                }

                paste.setAttribute( 'firstLoad', firstLoad );
                paste.setAttribute( 'nextLoad', nextLoad );

                switch ( firstLoad ) {
                    case 'html':
                        paste.connectedCallback();
                        check();
                        break;
                    case 'loader':
                        newTextReplace();
                        sinonFun.callsFake( function replaceDiv() {
                            paste.replaceDiv( `<div class="paste__replace">${textReplace}</div>`);
                        });
                        paste.connectedCallback();
                        check();
                        break;
                }
                switch ( nextLoad ) {
                    case 'html':
                        newTextReplace();
                        sinonFun.callsFake( function replaceDiv() {
                            paste.replaceDiv( `<div class="paste__replace">${textReplace}</div>`);
                        });
                        paste.attributeChangedCallback( 'url', 'test', '#' );
                        check();
                        break;
                    case 'loader':
                        newTextReplace();
                        sinonFun.callsFake( function replaceDiv() {
                            paste.replaceDiv( `<div class="paste__replace">${textReplace}</div>`);
                        });
                        paste.attributeChangedCallback( 'url', 'test', '#' );
                        check();
                        break;
                }
            });
        }

        for (let i = 0; i < mode.length; i++) {
            for (let k = 0; k < mode.length; k++) {
                ajaxQuery( mode[i], mode[k] );
            }
        }
    });

    describe(`Проверяем работу прогресс-бара:`, function() {

        let paste = new Paste();
        paste.insertAdjacentHTML( 'beforeend', `<div class="paste__progress"></div>` );
        //let sinonFun = sinon.stub( paste, '' );

        beforeEach(() => {
            paste.setAttribute( 'class', 'paste' );
            paste.setAttribute( 'url', '#' );
            paste.dom = Template.mapDom( paste );
        });

        it(`Проверяем работу метода "moveProgress":`, function() {
            paste.barSpeedProgress = Math.floor( Math.random() * 100 );
            paste.barStandartProgress = Math.floor( Math.random() * 100 );
            paste.currentProgress = 0;
            paste.moveProgress();
            assert.equal( paste.dom.tagProgress.hasAttribute('style'), true, 'Атрибут "style" не установлен!' );
            assert.equal( paste.dom.tagProgress.style.getPropertyValue('width') == paste.currentProgress + '%', true, 'Значение в атрибуте "style" установлено не верно!');
        });

        it(`Проверяем работу метода "standartProgress":`, function() {
            let clock = sinon.useFakeTimers({toFake: ["setTimeout"]});
            sinon.stub( clock, 'setTimeout' ).callsFake(function mytime() {
                paste.standartProgress();
            });
            paste.barSpeedProgress = 0;
            paste.barStandartProgress = 0;
            paste.currentProgress = 0;
            paste.standartProgress();
            assert.equal( paste.currentProgress == 100, true, 'Прогресс-бар не достиг 100%!' );
        });
    });
});

/**
 * Запуск тестов.
 */
mocha.run();
