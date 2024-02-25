
export const ClearGameDataInStorage = () => {
  if (window.localStorage) {
    window.localStorage.setItem("activeGame", '');
  }
}