import './App.css'

import { ReactElement, useEffect, useMemo, useRef, useState } from 'react'

import { ListOfUsers, ResultOfUser, SortBy } from './interfaces/user';
import { UserList } from './components/UserList';

function App() {

  const [users, setUsers] = useState<ListOfUsers>([]);
  const [rowColored, setRowColored] = useState<boolean>(false);
  const [sorted, setSorted] = useState<SortBy>(SortBy.NONE);
  const [filterByCoutry, setFilterByCountry] = useState<string | null>(null);
  const originalUsers = useRef<ListOfUsers>([]);

  useEffect(()=> {
    const getRandomUsers = async() => {
      const data: ResultOfUser = await (await fetch('https://randomuser.me/api/?results=100')).json()
      setUsers(data.results);
      originalUsers.current = data.results;
    }
    
    getRandomUsers()
    
  }, []);

 console.log('lalo');
 
  
  const deleteUser = (email: string) => {
    const newUserList =  users.filter(user => user.email !== email);
    setUsers(newUserList);
  }

  const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) =>{
    const country  = ev.target.value.toLowerCase();
    setFilterByCountry(country);
  }

  const handleSorted = ( sortBy: SortBy) => {
    if(sorted === sortBy) setSorted(SortBy.NONE)
    else setSorted(sortBy);
    
  }

  const filteredUser = useMemo(() =>{
     
    console.log('datos filtrados')
      
    return filterByCoutry && filterByCoutry?.length > 0?
        users.filter(user => user.location.country.toLowerCase().includes(filterByCoutry))
        : users
    }

    , [filterByCoutry, users])


  const sortedUser = useMemo(() => {
    console.log('datos organizados');
    
    if(sorted === SortBy.COUNTRY){
      return filteredUser.toSorted((a, b) =>
        a.location.country.localeCompare(b.location.country)
      )

    }else if(sorted === SortBy.LAST){
      return filteredUser.toSorted((a, b) =>
        a.name.last.localeCompare(b.name.last)
      )
    }else if(sorted === SortBy.NAME){
      return filteredUser.toSorted((a, b) =>
        a.name.first.localeCompare(b.name.first)
      )
    }

    return filteredUser;
    

  },[sorted, filteredUser])
  


  return (
    <>
      <h2>Prueba tecnica</h2>
      <header>
        <button onClick={() => setRowColored(!rowColored) }>Colorear filas</button>
        <button onClick={() => handleSorted(SortBy.COUNTRY)}>{sorted === SortBy.COUNTRY? 'No ordenar por país': 'Ordenar por país'}</button>
        <button onClick={() => setUsers(originalUsers.current)}> Restablecer usuarios </button>
        <input 
          type="text"
          placeholder='Filter por país' 
          onChange={handleInputChange}/>
      </header>
      <main>
        <UserList 
          users={sortedUser}
          colorRow={rowColored}
          deleteUser={deleteUser}
          sortByColumn={handleSorted}/>
      </main>
    </>
  )
}

export default App
