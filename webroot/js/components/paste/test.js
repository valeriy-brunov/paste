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

        beforeEach(() => {
            paste.setAttribute( 'class', 'paste' );
            paste.setAttribute( 'url', '#' );
            paste.dom = Template.mapDom( paste );
        });

        it(`Проверяем работу метода "moveProgress".`, function() {
            paste.barSpeedProgress = Math.floor( Math.random() * 100 );
            paste.barStandartProgress = Math.floor( Math.random() * 100 );
            paste.currentProgress = 0;
            paste.moveProgress();
            assert.equal( paste.dom.tagProgress.hasAttribute('style'), true, 'Атрибут "style" не установлен!' );
            assert.equal( paste.dom.tagProgress.style.getPropertyValue('width') == paste.currentProgress + '%', true, 'Значение в атрибуте "style" установлено не верно!');
        });

        it(`Проверяем работу метода "standartProgress".`, function() {
            let clock = sinon.useFakeTimers({toFake: ["setTimeout"]});
            sinon.stub( clock, 'setTimeout' ).callsFake( function mytime() {
                paste.standartProgress();
            });
            paste.barSpeedProgress = 0;
            paste.barStandartProgress = 0;
            paste.currentProgress = 0;
            paste.standartProgress();
            assert.equal( paste.currentProgress == 100, true, 'Прогресс-бар не достиг 100%!' );
        });

        it(`Проверяем работу метода "limitSpeedProgress".`, function() {
            let clock = sinon.useFakeTimers({toFake: ["setTimeout"]});
            sinon.stub( clock, 'setTimeout' ).callsFake( function mytime() {
                if ( paste.currentProgress < paste.limit ) {
                    paste.limitSpeedProgress();
                }
            });
            paste.barSpeedProgress = 0;
            paste.barStandartProgress = 0;
            paste.currentProgress = 0;
            [0, 20, 40, 70, 100].forEach((item, index, array) => {
                paste.limit = item;
                paste.limitSpeedProgress();
                assert.equal( paste.currentProgress == item, true, `Прогресс-бар не достиг ${item}%!` );
            });
        });

        it(`Проверяем работу метода "calculatingLimit".`, function() {
            let total = [0,   1,  1,   2,  2,   10];
            let load  = [0,   0,  1,   1,  2,   5 ];
            let limit = [100, 50, 100, 75, 100, 75];
            for (let i = 0; i < total.length; i++) {
                paste.totalLoad = total[i];
                paste.load = load[i];
                paste.calculatingLimit();
                assert.equal( paste.limit == limit[i], true, `Ошибка в расчёте параметра "limit"!` );
            }
        });

        it(`Проверяем работу метода"moveTagsScript".`, function() {
            // Возвращает строку, содержащую теги "<script>".
            let createTagScript = function( countLoad, countNotLoad ) {
                let total = countLoad + countNotLoad;
                let url = document.getElementsByTagName('script')[0].getAttribute('src');
                if ( url ) {
                    let html = '';
                    for ( let i = 0; i < total; i++ ) {
                        if ( countLoad > 0 ) {
                            html+= `<script src="${url}"></script>`;
                            countLoad--;
                        }
                        if ( countNotLoad > 0 ) {
                            html+= '<script src="#.js"></script>';
                            countNotLoad--;
                        }
                    }
                    return html;
                }
                else return '';
            };
            // Строка из случайных символов (букв и цифр).
            let randString = function( len, numbers = true ) {
                let str = '';
                let simbol = ['a','b','c','m','f','r','t'];
                if ( numbers ) {
                    simbol.push( '0','1','2','3','4','5','6','7','8','9' );
                }
                for ( let i = 0; i < len; i++) {
                    let val = Math.floor( Math.random()*( simbol.length ) );
                    str+=simbol[val];
                }
                return str;
            }
            // Создаёт Html код.
            let createHtml = function( countDiv, startDiv = false ) {
                let str = '';
                let wrapDiv = function() {
                    let str = '<div class="' + randString(5, false) + randString(10) + '">';
                    str+= randString( Math.floor( Math.random()*100 +1 ));
                    str+= '</div>';
                    return str;
                };
                for( let i = 1; i < countDiv + 1; i++ ) {
                    if( startDiv ) {
                        str+= wrapDiv();
                        startDiv = false;
                    }
                    str+= randString( Math.floor( Math.random()*100 + 1 ));
                    str+= wrapDiv();
                    str+= randString( Math.floor( Math.random()*100 + 1 ));
                }
                return str;
            }

            let html = createHtml( 2, true );
            let newHtml = paste.moveTagsScript( html );
            assert.equal( html == newHtml, true, `Ошибка! Скрипт должен вернуть переданную строку!` );

            let html2 = createHtml( 2 );
            let newHtml2 = paste.moveTagsScript( html2 );
            assert.equal( html2 == newHtml2, true, `Ошибка! Скрипт должен вернуть переданную строку!` );

            let head = document.getElementsByTagName('head')[0];
            
            for (let i = 0; i < 10; i++) {
                for (let k = 0; k < 10; k++) {
                    if ( i > 0 || k > 0 ) {
                        paste.totalLoad = 0;
                        let htmlStr = createHtml( 2, true );
                        let strHtml = createTagScript( i, k ) + htmlStr;
                        let html = paste.moveTagsScript( strHtml );
                        assert.equal( html == htmlStr, true, `Возвращаемая строка не совпадает со строкой, переданной коду!` );
                        let tagScripts = head.querySelectorAll('[data-load]');
                        assert.equal( tagScripts.length == paste.totalLoad, true, `Значение "totalLoad" не совпадает с количеством тегов <script>!` );
                        let tagScriptsLoad = head.querySelectorAll('script[data-load=\"1\"]');
                        let tagScriptsNotLoad = head.querySelectorAll('script[data-load=\"0\"]');
                        let sym = tagScriptsNotLoad.length + tagScriptsLoad.length;
                        assert.equal( sym == (i + k), true, `Не совпадает количество тегов с "data-load"="1" и "data-load"="0"!` );
                        for ( let tagScript of tagScripts) {
                            tagScript.remove();
                        }
                    }
                }
            }
        });
    });
});

/**
 * Запуск тестов.
 */
mocha.run();
