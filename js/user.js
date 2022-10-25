window.addEventListener('load', async function() {

	if (!ethEnabled()) {
  		alert("Por favor, instale um navegador compatível com Ethereum ou uma extensão como o MetaMask para utilizar esse dApp!");
	}
	else {
		getMyAccounts(await web3.eth.getAccounts());

		eleicao = new web3.eth.Contract(VotingContractInterface, CONTRACT_ADDRESS);
		getCandidatos(eleicao, populaCandidatosOptions);
		await getChairperson(eleicao, setIsAdmin);
		getVoterInfo(eleicao, web3.utils.toHex(myAddress), updateMyStatus);
        checkIfBallotIsOpened(eleicao);
	}
});

function checkIfBallotIsOpened(contractRef) {
    contractRef.methods.isOpened().call(async function (_, isOpened) {
      if (!isOpened) {
        $("#votacao").remove();
        $("#myStatus").remove();
        document.getElementById('ballotStatus').innerHTML = '<h3 class="alert alert-danger">Votação encerrada</h3>';
      }
    });
  }

$("#btnVote").on('click',function(){
	candidato = $("#candidate-options").children("option:selected").val();

        eleicao.methods.vote(candidato).send({from: myAddress})
	       .on('receipt',function(receipt) {
			window.location.reload();
		})
		.on('error',function(error) {
			console.log(error.message);
               		return;     
        	});  

});

function updateMyStatus(voterInfo) {
	if (voterInfo.weight > 0) {
		if(voterInfo.delegate !== ZERO_ADDRESS) {
			document.getElementById('myStatus').innerHTML = '<h3 class="alert alert-warning">Voce delegou o voto</h3>';
		} else if (voterInfo.voted) {
			document.getElementById('myStatus').innerHTML = '<h3 class="alert alert-success">Voce ja votou</h3>';
		} else {
			document.getElementById('myStatus').innerHTML = '<h3 class="alert alert-info">Voce ainda nao votou</h3>';
		}
	} else {
		document.getElementById('myStatus').innerHTML = '<h3 class="alert alert-danger">Voce nao tem direito a voto</h3>';
	}
	if (voterInfo.name === '' && isAdmin) {
		voterInfo.name = 'Admin';
	}
	document.getElementById('myName').innerHTML = '<strong>Seu nome:</strong> ' + voterInfo.name;
}

function delegarVoto() {
	const delegateAddress = document.getElementById('delegateAddress').value;
	delegate(eleicao, delegateAddress, function (result) {
		window.location.reload();
	});
}