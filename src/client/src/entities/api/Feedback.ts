
export type Request = {
  name: string
  email: string
  message: string
  variant: string
}

/**
 * Result with data
 */
export type Success = {
  // offer: Offer
}

type Response = {
  success: boolean,
  message?: string
  errors?: any
}

/**
 * Parse pnr request
 * @param data
 * @param successCallback
 * @param errorCallback
 * @constructor
 */
export const Feedback = (
  data:Request,
  successCallback:()=>void,
  errorCallback:(error:string)=>void
) => {

  const cfg = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
      "Accept": "application/json",
      // 'Authorization': 'Bearer '+token
    },
    body: JSON.stringify(data),
  }

  fetch('/api/feedback', cfg)
  .then((response) => {
    // if (response.status === 401) throw new AuthError()
    return response.json()
  })
  .then((data:Response) =>
  {
    // check success result
    if (!data.success) {
      const e = (data.message) ? data.message : "Request error";
      if (data.errors) {
        console.warn('there are validation errors in request', data.errors)
      }
      throw new Error(e)
    }

    // rise call back
    successCallback()

  })
  .catch((error) => {


    // we do not save error in store just call callback
    const errorMessage = (error.message) ? error.message : 'Request error'
    errorCallback(errorMessage)
  });

}
