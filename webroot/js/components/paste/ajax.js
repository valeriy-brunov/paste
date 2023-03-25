/**
 * AJAX-запрос.
 */
export default {

    /**
     * Параметры запроса по умолчанию.
     */
    get default_params() {
        return {
            method: 'GET',
            async: true,
            typeReturn: 'html',
            file: false,
            beforeSend: function() {},
            success: function() {},
            error: function( status, statusText ) {
                if ( status != 200 ) {
                    console.log( 'Ошибка запроса - ' + status + ':' + statusText );
                }
            },
            errorConnect: function() {
                console.log( 'Ошибка соединения!' );
            },
            progress: function() {},
        }
    },

    /**
     * XMLHttpRequest-запрос.
     * 
     * @param {object} param
     *      Параметры запроса:
     *          url: адрес запроса;
     *          method: метод запроса GET или POST;
     *          Тип передаваемых данных на сервер (указывается один из типов). Если не требуется передача данных
     *          на сервер, тип данных указывать не нужно (простой запрос):
     *              - data: данные передоваемые в запросе (строка или объект, обычно содержит данные формы);
     *              - json: JSON-данные;
     *              - file: выгрузка файла на сервер (по умолчанию false). Для передачи файла(ов) необходимо
     *                      указать объект <input> загрузки.
     *          typeReturn: тип возвращаемых данных, содержащихся в ответе сервера:
     *              - html (по умолчанию);
     *              - json;
     *              - document (XML).
     *          async: асинхронно или синхронно;
     *      Параметры, прикреплённые к событиям:
     *          beforeSend: функция срабатывает перед AJAX-запросом;
     *          success: ответ от сервера успешно получен;
     *          progress: отслеживает загрузку;
     *          errorConnect: срабатывает, если произошла ошибка соединения;
     *          error: сработывает, если произошла ошибка запроса.
     */
    connect( params ) {
        let p = this.default_params;
        Object.assign( p, params );
        if ( "url" in p ) {
            p.beforeSend();
            const request = new XMLHttpRequest();
            if ( p.file ) {
                request.upload.addEventListener('progress', (e) => {
                    p.progress( e.loaded, e.total );
                });
                request.onloadend.addEventListener('loadend', (e) => {
                    if ( request.status == 200 ) {
                        p.success();
                    }
                    else {
                        p.error( request.status, request.statusText );
                    }
                });

                request.open( 'POST', p.url, p.async );
                request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                request.send( p.file );
            }
            else {
                if ( p.type == 'json' ) request.responseType = 'json';
                if ( p.type == 'document' ) request.responseType = 'document';
                request.open( p.method, p.url, p.async );
                request.setRequestHeader("X-Requested-With", "XMLHttpRequest");

                request.addEventListener('load', (e) => {
                    if (request.status != 200) {
                        p.error( request.status, request.statusText );
                    }
                    else {
                        p.success( e.target.response );
                    }
                });
                request.addEventListener('error', () => {
                    p.errorConnect();
                });
                request.addEventListener('progress', ( e ) => {
                    p.progress( e.loaded, e.total );
                });

                if ( "data" in p ) {
                    request.send( p.data );
                }
                else {
                    if ( "json" in p ) {
                        request.send( JSON.stringify( p.json ) );
                    }
                    else {
                        request.send();
                    }
                }
            }
        }
        else {
            console.log('Не указан адрес запроса url!');
        }
    },
}
