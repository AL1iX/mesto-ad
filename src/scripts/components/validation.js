const showInputError = (formElement, inputElement, errorMessage, settings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`)
  inputElement.classList.add(settings.inputErrorClass)
  errorElement.textContent = errorMessage
  errorElement.classList.add(settings.errorClass)
}

const hideInputError = (formElement, inputElement, settings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`)
  inputElement.classList.remove(settings.inputErrorClass)
  errorElement.textContent = ""
  errorElement.classList.remove(settings.errorClass)
}

const checkInputValidity = (formElement, inputElement, settings) => {
  const trimmedValue = inputElement.value.trim()

  inputElement.setCustomValidity("")

  if (inputElement.required && trimmedValue.length === 0) {
    inputElement.setCustomValidity("Заполните это поле.")
  }

  if (inputElement.dataset.errorMessage && trimmedValue.length > 0) {
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/
    if (!nameRegex.test(trimmedValue)) {
      inputElement.setCustomValidity(inputElement.dataset.errorMessage)
    }
  }

  if (!inputElement.validity.valid) {
    const errorMessage = inputElement.validationMessage
    showInputError(formElement, inputElement, errorMessage, settings)
    return false
  } else {
    hideInputError(formElement, inputElement, settings)
    return true
  }
}

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid
  })
}

const disableSubmitButton = (buttonElement, settings) => {
  buttonElement.classList.add(settings.inactiveButtonClass)
  buttonElement.disabled = true
}

const enableSubmitButton = (buttonElement, settings) => {
  buttonElement.classList.remove(settings.inactiveButtonClass)
  buttonElement.disabled = false
}

const toggleButtonState = (inputList, buttonElement, settings) => {
  if (hasInvalidInput(inputList)) {
    disableSubmitButton(buttonElement, settings)
  } else {
    enableSubmitButton(buttonElement, settings)
  }
}

const setEventListeners = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector))
  const buttonElement = formElement.querySelector(settings.submitButtonSelector)

  toggleButtonState(inputList, buttonElement, settings)

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement, settings)
      toggleButtonState(inputList, buttonElement, settings)
    })
  })
}

export const clearValidation = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector))
  const buttonElement = formElement.querySelector(settings.submitButtonSelector)

  inputList.forEach((inputElement) => {
    inputElement.setCustomValidity("")
    hideInputError(formElement, inputElement, settings)
  })

  disableSubmitButton(buttonElement, settings)
}

export const enableValidation = (settings) => {
  const formList = Array.from(document.querySelectorAll(settings.formSelector))

  formList.forEach((formElement) => {
    setEventListeners(formElement, settings)
  })
}
