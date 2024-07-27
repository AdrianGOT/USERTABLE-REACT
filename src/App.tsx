import './App.css'

import {  useMemo, useRef, useState } from 'react'

import { SortBy } from './interfaces/user';
import { UserList } from './components/UserList';
import { useUsers } from './hooks/useUsers';

function App() {

  const {
    setCurrentPage,
    originalUsers, 
    currentPage, 
    // setUsers, 
    loading, 
    users, 
    err, 
   } = useUsers();
  const [rowColored, setRowColored] = useState<boolean>(false);
  const [sorted, setSorted] = useState<SortBy>(SortBy.NONE);
  const [filterByCoutry, setFilterByCountry] = useState<string | null>(null);
  
 console.log(users);
 

  const deleteUser = (email: string) => {
    // const newUserList =  users.filter(user => user.email !== email);
    // setUsers(newUserList);
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
        {/* <button onClick={() => setUsers(originalUsers.current)}> Restablecer usuarios </button> */}
        <input 
          type="text"
          placeholder='Filter por país' 
          onChange={handleInputChange}/>
      </header>
      <main>
        {users.length > 0 &&  (
          
          <UserList 
            users={sortedUser}
            colorRow={rowColored}
            deleteUser={deleteUser}
            sortByColumn={handleSorted}/>
        )}
        {loading && <p> Cargando ... </p>  }
        {!loading && err && <p> Ha habido un error al cargar los datos</p>  }
        {!loading && !err && users.length === 0 && <p>No hay datos para mostrar</p>  }

        {
          !loading && !err && users.length > 0 && (
            <button 
              onClick={() => setCurrentPage(currentPage + 1)}>
                Siguiente página
            </button>
          )
        }

      </main>
    </>
  )
}

export default App
