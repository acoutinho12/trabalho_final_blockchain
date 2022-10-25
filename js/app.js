
const tableElem = document.getElementById("table-body");
const tableEleitores = document.getElementById("table-voter");
const candidateOptions = document.getElementById("candidate-options");
const voteForm = document.getElementById("vote-form");

var proposals = [];
var myAddress;
var isAdmin = false;
var eleicao;
const CONTRACT_ADDRESS = "0x00ac0d7C3d09bd4BF1198cF647Cd10851EAae937";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const ethEnabled = () => {
	if (window.ethereum) {
    		window.web3 = new Web3(window.ethereum);
    		window.ethereum.enable();
    		return true;
  	}
  	return false;
}

const getMyAccounts = accounts => {
	try {
		if (accounts.length == 0) {
			alert("Você não tem contas habilitadas no Metamask!");
		} else {
			myAddress = accounts[0];
			accounts.forEach(async myAddress => {
				console.log(myAddress + " : " + await window.web3.eth.getBalance(myAddress));
			});
		}
	} catch(error) {
		console.log("Erro ao obter contas...");
	}
};

function getCandidatos(contractRef,callback)
{
	//contractRef.methods.getProposalsCount().call().then((count)=>{
	contractRef.methods.getProposalsCount().call(async function (error, count) {
		for (i=0; i<count; i++) {
			await contractRef.methods.getProposal(i).call().then((data)=>{
				var proposal = {
          				name : data[0],
          				voteCount : data[1]
      				};
				proposals.push(proposal);
 			});
		}
		if (callback) {
			callback(proposals);
		}

	});
}
function getEleitores(contractRef,callback)
{
	//contractRef.methods.getProposalsCount().call().then((count)=>{
	contractRef.methods.getVoterList().call(async function (error, voters) {
		if (callback) {
			callback(voters);
		}

	});
}

function populaCandidatosTable(candidatos) {
	candidatos.forEach((candidato, index) => {
		// Creates a row element.
		const rowElem = document.createElement("tr");

		// Creates a cell element for the name.
		const nameCell = document.createElement("td");
		nameCell.innerText = candidato.name;
		rowElem.appendChild(nameCell);

		// Creates a cell element for the votes.
		const voteCell = document.createElement("td");
		voteCell.id = "vote-" + candidato.name; 
		voteCell.innerText = candidato.voteCount;
		rowElem.appendChild(voteCell);

		// Adds the new row to the voting table.
		tableElem.appendChild(rowElem);
    });
}

function populaEleitoresTable(eleitores) {
	eleitores.forEach((eleitor, index) => {
		// Creates a row element.
		const rowElem = document.createElement("tr");

		// Creates a cell element for the name.
		const nameCell = document.createElement("td");
		nameCell.innerText = eleitor.name;
		rowElem.appendChild(nameCell);

		// Creates a cell element for the votes.
		const voteCell = document.createElement("td");
		voteCell.id = "vote-" + eleitor.name; 
		voteCell.innerText = eleitor.voted ? "Sim": "Não";
		rowElem.appendChild(voteCell);

		// Creates a cell element for the votes.
		const delegateCell = document.createElement("td");
		delegateCell.id = "delegate-" + eleitor.name;
		delegateCell.innerText = eleitor.delegate != ZERO_ADDRESS ? "Sim": "Não";
		rowElem.appendChild(delegateCell);

		// Adds the new row to the voting table.
		tableEleitores.appendChild(rowElem);
    });
}

function populaCandidatosOptions(candidatos) {
	candidatos.forEach((candidato, index) => {
		// Creates an option for each candidate
		const candidateOption = document.createElement("option");
		candidateOption.value = index;
		candidateOption.innerText = candidato.name;
		candidateOptions.appendChild(candidateOption);
    });
}

async function getChairperson(contractRef, callback) {
	contractRef.methods.getChairPerson().call().then((data) => {
		if (callback) {
			callback(data);
		}
	});
}

function setIsAdmin(chairpersonAddress) {
	isAdmin = chairpersonAddress === myAddress;
}

function getVoterList(contractRef, callback) {
	contractRef.methods.getVoterList().call().then((data) => {
		if (callback) {
			callback(data);
		}
	});
}

function getVoterInfo(contractRef, address, callback) {
	contractRef.methods.voters(address).call().then((data) => {
		if (callback) {
			callback(data);
		}
	});
}

function delegate(contractRef, toAddress, callback) {
	contractRef.methods.delegate(toAddress).send({from: myAddress}, function(error, result) {
		if (error) {
			window.alert('Ocorreu um erro ao delegar');
		}
		if (callback) {
			callback(result);
		}
	});
}