window.addEventListener("load", async function () {
  if (!ethEnabled()) {
    alert(
      "Por favor, instale um navegador compatível com Ethereum ou uma extensão como o MetaMask para utilizar esse dApp!"
    );
  } else {
    getMyAccounts(await web3.eth.getAccounts());

    eleicao = new web3.eth.Contract(VotingContractInterface, CONTRACT_ADDRESS);
    getCandidatos(eleicao, populaCandidatosTable);
    getEleitores(eleicao, populaEleitoresTable);
    checkIfBallotIsOpened(eleicao);
  }
});

function checkIfBallotIsOpened(contractRef) {
  contractRef.methods.isOpened().call(async function (_, isOpened) {
    if (!isOpened) {
      $("#cadastrar").remove();
      $("#encerrar").remove();
    }
  });
}

$("#giveRightToVote").on("click", function () {
  nome = $("#name").val();
  endereco = $("#metamaskAddress").val();

  eleicao.methods
    .giveRightToVote(endereco, nome)
    .send({ from: myAddress })
    .on("receipt", function (receipt) {
      window.location.reload();
    })
    .on("error", function (error) {
      console.log(error.message);
      return;
    });
});

$("#addProposal").on("click", function () {
  nome = $("#proposalName").val();

  eleicao.methods
    .addProposal(nome)
    .send({ from: myAddress })
    .on("receipt", function (receipt) {
      window.location.reload();
    })
    .on("error", function (error) {
      console.log(error.message);
      return;
    });
});

$("#closeVote").on("click", function () {
  if (
    confirm(
      "Tem certeza que deseja encerrar a votação, essa ação não pode ser revertida!!!"
    ) == true
  ) {
    eleicao.methods
      .closeVote()
      .send({ from: myAddress })
      .on("receipt", function (receipt) {
        window.location.reload();
      })
      .on("error", function (error) {
        console.log(error.message);
        return;
      });
  }
});
