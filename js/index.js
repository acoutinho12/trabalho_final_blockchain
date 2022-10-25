var btnAdmin = document.getElementById("btnAdmin");
var btnEleitor = document.getElementById("btnEleitor");

window.addEventListener("load", async function () {
  if (!ethEnabled()) {
    alert(
      "Por favor, instale um navegador compatível com Ethereum ou uma extensão como o MetaMask para utilizar esse dApp!"
    );
  } else {
    getMyAccounts(await web3.eth.getAccounts());
    eleicao = new web3.eth.Contract(VotingContractInterface, CONTRACT_ADDRESS);
    await getChairperson(eleicao, checkAndEnableAdminButton);
    
  }
});

function checkAndEnableAdminButton(chairPersonAddress) {
  setIsAdmin(chairPersonAddress);
  if (isAdmin) {
    btnAdmin.disabled = false;
  }
}


