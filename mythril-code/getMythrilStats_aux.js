const fs = require('fs')
const path = require('path');
const ObjectsToCsv = require('objects-to-csv')
const glob = require("glob")
//const neatCsv = require('neat-csv')
//const xlsxFile = require('read-excel-file/node')

// /mnt/d/ inicio caminho ubunut // D:/
const folder1 = '/mnt/d/Dropbox/0_ISEP/TDMEI/tdmei/other/mythril/'
const folder2 = 'D:/Dropbox/0_ISEP/TDMEI/tdmei/test/'
let stats = [] //stats por vulnerabilidade
let stats2 = [] //stats por contrato
let errors = []
let cleanContracts = []
let total = 0
let names = []

const getPatterns = (folder) => {
    //glob("**/*.js", options, function (er, files) { // options is optional
    glob(folder+'*', function (er, files) {
        console.log('Total files:' +files.length)
        for (let i=0; i<files.length; i++) {
            //let fileName = path.basename(files[i],'.sol')
                let fileName = path.basename(files[i])
                fileName = fileName.split('.').slice(0, -1).join('.') // remover extensao
                names.push(fileName)
                //console.log(fileName)
            }
    })
}

/*fs.readdir(path, function(err, items) {for (var i=0; i<items.length; i++) {console.log(items[i])}});*/
const getStats = (folder) => { //glob("**/*.js", options, function (er, files) { // options is optional
    glob(folder+'*.json', function (er, files) {
        console.log('Total contracts:' +files.length)
        for (let i=0; i<files.length; i++) {
            let fileName = path.basename(files[i]) //let fileName = path.basename(files[i],'.sol')
            fileName = fileName.split('.').slice(0, -1).join('.') // remover extensao
            let obj = JSON.parse(fs.readFileSync(files[i], 'utf8'));
            
            if (obj.error !== null){
                errors.push(fileName)
                names.push(fileName)
            }

            if (obj.success === true && obj.issues.length === 0){ //console.log("Success: "+obj.success)
                cleanContracts.push(fileName)
                names.push(fileName)
            }
            //let fileLines = fs.readFileSync(files[i]).toString().split("\n") // para criar array de strings
            //if (!fileLines[0].includes("{")){console.log(fileName);}
            //console.log('Issues length: '+obj.issues.length)  
            for (let j=0; j<obj.issues.length; j++) {
                if (j === 0){names.push(fileName)}
                total++
                let contractsArray, aux
                let aux2 = stats.filter(stat => stat.swcId === obj.issues[j]['swc-id'])
                if (aux2.length > 0){ //console.log(j+' - Aux2:' +JSON.stringify(aux2, null, '\t'))
                    aux2[0].count++ //console.log('Count: '+aux2[0].count)
                    aux2[0].contracts.push(fileName) //console.log('Contracts: '+aux2[0].contracts)  
                }else{
                    contractsArray = []; contractsArray.push(fileName)
                    aux = {swcId: obj.issues[j]['swc-id'], title:obj.issues[j].title, count: 1, contracts: contractsArray}
                    stats.push(aux)
                }
                aux2 = stats2.filter(stat => stat.contract === fileName)
                if (aux2.length > 0){ 
                    aux2[0].count++
                    aux2[0].vulns.push(obj.issues[j]['swc-id'])
                }else{
                    contractsArray = []; contractsArray.push(obj.issues[j]['swc-id'])
                    aux = {contract: fileName, count: 1, vulns: contractsArray} 
                    stats2.push(aux)
                }
            }
        }
    })
}

function foo(arr) { //conta repeticoes de cada item em um array
    var a = [], b = [], prev;

    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }

    return [a, b];
}

getPatterns(folder1)
getStats(folder1)

setTimeout(async () => {
    const unique = foo(names)
    console.log('Not found files: ')
    for (let i=0; i<unique[0].length; i++) {
        if (unique[1][i] < 2){
            console.log(unique[0][i]) 
        }
    }
    //console.log('Total Vulnerabilities: '+total)
    //console.log('Clean: '+cleanContracts.length+' - '+JSON.stringify(cleanContracts, null, '\t')) 
    //console.log('Clean: '+cleanContracts.length+' - '+cleanContracts) 
    //console.log('Errors: '+errors.length+' - '+JSON.stringify(errors, null, '\t')) 
    //console.log('Stats: '+JSON.stringify(stats, null, '\t'))  
    //let csv = new ObjectsToCsv(stats) // so funciona com arrays de objetos
    //await csv.toDisk('mythrilStats.csv', { append: false}) 
    //csv = new ObjectsToCsv(stats2) // so funciona com arrays de objetos
    //await csv.toDisk('mythrilStats_2.csv', { append: false}) 
},1000)





