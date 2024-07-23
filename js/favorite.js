import { GithubUser } from "./GithubUser.js";

export class Favorites {
  constructor(root){
    this.root = document.querySelector(root)
    this.load();

    GithubUser.search('maykbrito').then(user => console.log(user))
  }

  load(){
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [] 
    // console.log(this.entries);
  }

  save(){
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries));
  }

  async add(username){
    console.log(this.value)
    try {

      const userExists = this.entries.find(entry => entry.login === username);

      if (userExists) {
        throw new Error('Usuário já cadastrado')
      }

      const user = await GithubUser.search(username)
  
      // console.log(user);
      if (user.login === undefined) {
        throw new Error('Usuário não encontrado')
        
      }

      this.entries = [user, ...this.entries];
      this.update();
      this.save();
      
    } catch (error) {
      alert(error.message);
    }
  }

  delete(user){
    const filteredEntries = this.entries.filter(entry => entry.login != user.login);
    console.log(filteredEntries);

    this.entries = filteredEntries;
    this.update();
    this.save();

  }
}

export class FavoritesView extends Favorites{
  constructor(root){
    super(root)
    this.tbody = this.root.querySelector('table tbody');

    this.update();
    this.onAdd();
  }

  onAdd(){
    const addButton = this.root.querySelector('.search button');
    addButton.onclick = () => {
      this.value = this.root.querySelector('.search input').value;
      
      this.add(this.value)
    }
  }

  update() {
    this.removeAllTr();

    
    this.entries.forEach(user => {
      const row = this.createRow();
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`;
      row.querySelector('.user a').href = `https://github.com/${user.login}`;
      row.querySelector('.user p').textContent = user.name;
      row.querySelector('.user span').textContent = user.login;
      row.querySelector('.repositories').textContent = user.public_repos;
      row.querySelector('.follower').textContent = user.followers;

      row.querySelector('.remove').onclick = () => {
       const isOk = confirm('Tem certeza que deseja deletar essa linha?')

       if (isOk) {
         this.delete(user);
       }
      }


      this.tbody.append(row);
    })

    
  }
  
  createRow(){
    const tr = document.createElement('tr');
    tr.innerHTML = `
          <td class="user">
            <img src="https://github.com/maykbrito.png" alt="">
            <a href="https://github.com/maykbrito" target="_blank">
              <p>Mayk Brito</p>
              <span>maykbrito</span>
            </a>
          </td>
          <td class="repositories">
            76
          </td>
          <td class="follower">9585</td>
          <td>
            <button class="remove">&times;</button>
          </td>
    `
    return tr
  }

  removeAllTr(){

    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove();
    });
  }
}