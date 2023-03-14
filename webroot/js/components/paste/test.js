/**
 * Импортируем основные библиотеки для тестирования.
 */
import '/cms/webcomponent/js/testlibs/mocha.js';
import '/cms/webcomponent/js/testlibs/chai.js';

/**
 * Импортируем основные файлы веб-компонента для тестирования.
 */
import Paste from './paste.js';
import Template from './template.js';

// Для именованных классов необходимо создать объект.
let t = new Paste();

/**
 * Настраиваем библиотеки для тестирования.
 */
mocha.setup('bdd');
let assert = chai.assert;

/**
 * Тесты.
 */
describe("pow", function() {

    it("возводит в степень n", function() {
        assert.equal( t.pow(2, 3), 8);
    });

    it("Функция из файла template!", function() {
        assert.equal( Template.mapDomShadow(), 8 );
    });
});

/**
 * Запуск тестов.
 */
mocha.run();