import './style.css'
// import javascriptLogo from './javascript.svg'


// document.querySelector('#app').innerHTML = `
//   <div>

//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

document.addEventListener('DOMContentLoaded', ()=>{
  if(localStorage.getItem("accessToken")){
    window.location.href = "dashboard/dashboard.html" ;
  }
  else{
    window.location.href = "login/login.html" ;
  }
})


