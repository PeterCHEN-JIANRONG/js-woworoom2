
// 成功訊息
export function successAlertMsg(message){
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: message,
    showConfirmButton: false,
    timer: 1500
  });
}

// 失敗訊息
export function errorAlertMsg(message){
  Swal.fire({
    position: 'center',
    icon: 'error',
    title: message,
    showConfirmButton: false,
    timer: 1500
  });
}
