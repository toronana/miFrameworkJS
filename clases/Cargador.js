class Cargador extends EventTarget {
    // eventos
    static RESULTADO_OK = "RESULTADO_OK";
    static RESULTADO_ERROR = "RESULTADO_ERROR";
    //
    opciones = { bubbles:true, cancelable:true, detail:null};

    constructor (opcionesEvento=undefined){
        super();        
        if (opcionesEvento) this.opciones = opcionesEvento;
        this.url = "";
        this.formato = "json";
        this.respuesta = "";
        
        this.eventoError = new CustomEvent(Cargador.RESULTADO_ERROR, this.opciones);
        this.isOK = false;
    }

    cargar(){
        if (this.url == "") {
            this.respuesta = "¡Error, debe ingresar una url!";
            this.isOK = false;
            this.dispatchEvent(this.eventoError);

        } else {
            fetch(this.url).then(response => response.json()).then(data => {
                if (data.error_message) {                    
                    this.respuesta = data.error_message;
                    this.isOK = false;
                    this.dispatchEvent(this.eventoError);
                    throw new Error(data.error_message);
                    //console.error(data.error_message);
                } else {
                    this.respuesta = data;
                    this.isOK = true;
                    this.opciones.detail = data;
                    this.eventoOk = new CustomEvent(Cargador.RESULTADO_OK, this.opciones);
                    this.dispatchEvent(this.eventoOk);
                    //console.log(data);
                }
                
            }).then(null, error => {
                this.respuesta = error;
                this.isOK = false;
                this.dispatchEvent(this.eventoError);
                //console.error(error);
            });
        }
    }
}

/**uso */
var c = new Cargador();
c.url = "mal https://jsonplaceholder.typicode.com/todos/";
//c.url = "https://swapi.co/api/people/";
c.addEventListener(Cargador.RESULTADO_OK, onCargar);
c.addEventListener(Cargador.RESULTADO_ERROR, onErrorCargar);
c.cargar();

function onCargar(e){
    console.log("OK",c.respuesta);
    
}
function onErrorCargar(e){
    alert(c.respuesta);
    console.error("ERROR",c.respuesta);
}
