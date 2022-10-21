import "./css/index.css"
import IMask from "imask" //importa biblioteca imask

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path") //função de seleção dentro do documento por meio de seletores
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")

const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) { //função que recebe um argumento
  const colors = {
    "visa": ["#436D99", "#2D57F2"],
    "mastercard": ["#DF6F29", "#C69347"],
    "default": ["black", "gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0]) //seta algum atributo específico
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType //adiciona nossa função como um método global

// Security Code
const securityCode = document.querySelector('#security-code') //também serve document.getElementById('security-code')
const securityCodePattern = {
  mask: "0000", //padrão da máscara indica 4 dígitos
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

// Expiration Date
const expirationDate = document.getElementById('expiration-date')
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    }
  }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.getElementById('card-number')
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) { // o dispatch executa essa função a cada dígito inserido
    const number = (dynamicMasked.value + appended).replace(/\D/g, ''); // se o dígito não for númerico ele é replace por '' (nulo)
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    console.log(foundMask)

    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert("Cartão adicionado!")
}) // event Listener fica "observando" a ocorrência de um determinado evento em um elemento

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault() // remove a ação de recargar a página
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value // passa o que a pessoa estiver digitando no input para a classe .cc-holder .value
})

securityCodeMasked.on("accept", () => { // on funciona como EventListener monitorando eventos
  updateSecurityCode(securityCodeMasked.value) // passa o valor do input para a função ser executada
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value") // meio que pega o endereço

  ccSecurity.innerText = code.length === 0 ? "123" : code // altera o endereço
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype // acessa o tipo do cartão
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value")
  ccExpiration.innerText = data.length === 0 ? "02/32" : date
}