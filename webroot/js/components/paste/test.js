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

    describe("Проверка на установку классов:", function() {

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

        let typeload = ['html', 'loader', 'progress', 'progress-loader'];
        let classpaste = ['replace', 'trubber', 'replace', 'trubber'];
        for (let i = 0; i < typeload.length; i++) {
            firstload( typeload[i], classpaste[i] );
        }
    });

    /*it("Функция из файла template!", function() {
        assert.equal( Template.mapDomShadow(), 8 );
    });*/
});

/**
 * Запуск тестов.
 */
mocha.run();