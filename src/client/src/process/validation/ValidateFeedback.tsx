
type feedbackData = {
  name: string,
  email: string,
  message: string,
  variant: string
}

type feedbackValidationResult = {
  isValid: boolean,
  errors: {
    name: string,
    email: string,
    message: string,
    variant: string
  }
}

export const ValidateFeedback = (data:feedbackData, validateEmptyField:boolean):feedbackValidationResult =>
{
  const isNameValid = validateTextField(data.name, validateEmptyField)
  const isEmailValid = validateTextField(data.email, validateEmptyField)
  const isMessageValid = validateTextField(data.message, validateEmptyField)
  const isVariantValid = validateTextField(data.variant, validateEmptyField)

  return {
    isValid: (isNameValid.isValid && isEmailValid.isValid && isMessageValid.isValid && isVariantValid.isValid),
    errors: {
      name: isNameValid.error,
      email: isEmailValid.error,
      message: isMessageValid.error,
      variant: isVariantValid.error
    }
  }

}

const validateTextField = (value:string, validateEmptyField:boolean):{isValid:boolean, error:string} => {
  value = value.trim()
  if (validateEmptyField && value === '') {
    return {isValid: false, error: "Required field"}
  }

  return {isValid: true, error: ''}
}