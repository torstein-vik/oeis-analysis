"use strict";

const sagereg = /^\((SAGE|Sage)\)(.*)$/;

function handle(doc){
    if(doc.program){
        doc.program.forEach((program) => {
            var res = sagereg.exec(program);
            if(res){
                var code = res[2];
                console.log(code);
            }
        });
    } else {
        console.log("Don't know what to do with " + doc.number)
    }
}

function verify(doc, f){

}

module.exports = {
    handle: handle
};
