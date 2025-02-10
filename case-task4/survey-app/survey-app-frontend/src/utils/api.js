const token = localStorage.getItem("token"); 

fetch("http://localhost:5000/api/surveys", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, 
  },
})
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
