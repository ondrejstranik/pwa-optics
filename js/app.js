
// parameter definition

// rid .. id of each new row
var rid = 1
// tran .. transmission of the matrix
var tran = 1

// definition of the objects
var refindexes = {
// real part ref. inxes | imag. part ref. indes | double layer | transmission | name 
// values taken from https://refractiveindex.info for wavelength 587.6 nm 


"Lens": ["1.5","0",true, true, "Lens"],
"Ag": ["0.15016","3.4727",false, false, "Mirror Ag"],
"Au": ["0.27035", "2.7790",false, false, "Mirror Au"],
"Al": ["1.0972", "6.7942",false, false, "Mirror Al"],
"singleT":["1.33","0",false,true, "Single interface T"],
"singleR":["1.33","0",false, false, "Single interface R"],
}

// runing code

setpage()
calculteLosses()


// function definition

function setpage(){
// populating the object selector
var mykey = Object.keys(refindexes)
for (var ii=0; ii < Object.keys(refindexes).length; ii++) {
document.getElementById('objects').options[ii] = new Option(refindexes[mykey[ii]][4],mykey[ii],  false, false)
}
// seting the default selecction .. mydef
const mydef = 0
document.getElementById('objects').options[mydef].defaultSelected = true
const e = new Event("change");
document.querySelector('#objects').dispatchEvent(e)
}

function getRowEvent(mytableid) {
// get the row in table, where the buttom was clicked
    var table = document.getElementById(mytableid);
    nr = 1
    // decide, which row was selected
    selid = event.target.parentNode.parentNode.id
    for (var i = 1; i < table.rows.length; i++) {
        if (table.rows[i].id ===selid) {
            nr= i
        }
    }
    return nr

}

function deleteLayer() {
// delete the row, where the buttom was clicked

if (document.getElementById("myTable").rows.length > 2){
    document.getElementById("myTable").deleteRow(getRowEvent("myTable"));
    calculteLosses()
}
}

function addLayer() {
// add a row under where teh buttom was clicked
    var row = document.getElementById("myTable").insertRow(getRowEvent("myTable")+1);
    rid += 1
    row.id = 'rid'+rid

  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  var cell6 = row.insertCell(5);
  var cell7 = row.insertCell(6);

  const repetitionclone = document.getElementById('repetition').cloneNode(true)
  const objectclone = document.getElementById('objects').cloneNode(true)
  const rinrclone = document.getElementById('rinr').cloneNode(true)
  const riniclone = document.getElementById('rini').cloneNode(true)
  const cbclone = document.getElementById('cb').cloneNode(true)
  const addlayerclone = document.getElementById('addlayer').cloneNode(true)
  const deletelayerclone = document.getElementById('deletelayer').cloneNode(true)
  cell1.appendChild(repetitionclone)
  cell2.appendChild(objectclone)
  cell3.appendChild(rinrclone)
  cell4.appendChild(riniclone)
  cell5.appendChild(cbclone)
  cell6.appendChild(addlayerclone)
  cell7.appendChild(deletelayerclone)
    calculteLosses()

// set the default selection of the clone
cbclone.checked = true
repetitionclone.value = 1
objectclone.options[0].defaultSelected = true
const e = new Event("change");
objectclone.dispatchEvent(e)

}

function changeObject() {
// change the refractive index in the row, where the objected selector was used
var nr = getRowEvent("myTable")
document.getElementById("myTable").rows[nr].cells[2].children[0].value = refindexes[event.target.value][0]
document.getElementById("myTable").rows[nr].cells[3].children[0].value = refindexes[event.target.value][1]

calculteLosses()
}

function calculteLosses() {
// caluclate losses of the system
var table = document.getElementById("myTable")
var myT = 1
var ninr = document.getElementById('ni').value
var nini = 0
//document.getElementById("tran").innerHTML = 100
//document.getElementById("tran").innerHTML = table.rows[1].cells[4].children[0].checked
//sel = table.rows[1].cells[1].children[0]
mykey = Object.keys(refindexes)
//document.getElementById("tran").innerHTML = refindexes[sel.options[sel.selectedIndex].text]
//document.getElementById("tran").innerHTML = refindexes[mykey[sel.selectedIndex]][3]

//myT = sel.options[0].text

//document.getElementById("tran").innerHTML = R(1,1,1,2)

    for (var ii = 1; ii < table.rows.length; ii++) {
        if (table.rows[ii].cells[4].children[0].checked ==true) {
            sel = table.rows[ii].cells[1].children[0]
            var mylocT = 1
            // make repetitions
            for (var jj=0; jj < table.rows[ii].cells[0].children[0].value; jj++){
                noutr = table.rows[ii].cells[2].children[0].value
                nouti = table.rows[ii].cells[3].children[0].value
                // choose if double (or single) 
                if (refindexes[mykey[sel.selectedIndex]][2]==true){
                    ninr_original = ninr
                    nini_original = nini
                    // choose if transmission (or reflection)
                    if (refindexes[mykey[sel.selectedIndex]][3]==true){
                        mylocT *= (1- R(ninr,nini,noutr,nouti))
                        ninr = noutr
                        nini = nouti
                        noutr = ninr_original
                        nouti = nini_original
                        mylocT *= (1- R(ninr,nini,noutr,nouti))
                        ninr = noutr
                        nini = nouti
                    } else {
                        mylocT *= R(ninr,nini,noutr,nouti)**2
                    }
                } else {
                    // choose if transmission (or reflection)
                    if (refindexes[mykey[sel.selectedIndex]][3]==true){
                        mylocT *= (1- R(ninr,nini,noutr,nouti))
                        ninr = noutr
                        nini = nouti
                    } else {
                        mylocT *= R(ninr,nini,noutr,nouti)
                    }

                }
            }
            
            // take account # of repetitions
            //myT *= math.pow(mylocT,table.rows[ii].cells[0].children[0].value)
            myT *= mylocT
            
            //ninr =
            //myT = 2
        }

    }
    //myT = refindexes[table.rows[ii].cells[1].children[0].value][3]
    //myT = table.rows[ii].cells[1].children[0].value
    //document.getElementById("tran").innerHTML = refindexes[sel.options[sel.selectedIndex].text][3]
    document.getElementById("tran").innerHTML = (myT*100).toFixed(2)


    //document.getElementById("tran").innerHTML = table.rows[i].cell[4].children[0].value
    //mytran.innerHTML = table.rows[i].cell[4].children[0].value
}

function R(n1r,n1i,n2r,n2i) {
// frennel equation for the reflection
// input real and imaginary refractive indesex

var n1 = math.complex(n1r, n1i); 
var n2 = math.complex(n2r, n2i); 

myR = math.pow(math.abs(math.divide(math.subtract(n1, n2), math.add(n1,n2))),2)
return myR
}
