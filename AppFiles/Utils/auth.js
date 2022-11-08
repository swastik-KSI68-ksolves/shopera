async function Authenticate(mode, email, password) {
  const API_KEY = "AIzaSyBE95uSZmUcXMlBaG45SRk1Ksn1PQuVdR0";
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;

  let data = { email: email, password: password, returnSecureToken: true };

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response?.error) {
        return response.error?.message;
      } else {
        return response;
      }
    })
    .catch((err) => {
      console.log(err);
    });

  return response;
}
// for logging in user
export function userLogin(email, password) {
  return Authenticate("signInWithPassword", email, password);
}

// for signup user
export function userSignup(email, password) {
  return Authenticate("signUp", email, password);
}
