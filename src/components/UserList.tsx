import { ListOfUsers, SortBy } from "../interfaces/user"

interface Props {
    users: ListOfUsers,
    colorRow: boolean,
    deleteUser: (email: string) => void,
    sortByColumn: (sortBy: SortBy) => void
}

export const UserList:React.FC<Props> = ({ users, colorRow, deleteUser, sortByColumn })=> {

    return (
        <table width='100%'>
            <thead>
                <tr>
                    <th>FOTO</th>
                    <th onClick={() => sortByColumn(SortBy.NAME)}>NOMBRE</th>
                    <th onClick={() => sortByColumn(SortBy.LAST)}>APELLIDO</th>
                    <th onClick={() => sortByColumn(SortBy.COUNTRY)}>PAIS</th>
                    <th >ACCIONES</th>
                </tr>
            </thead>
            <tbody>
                {
                    users.map((user, index) => {
                        const backgroundColor = index % 2 === 0? '#333': '#555';
                        const color = colorRow ? backgroundColor : 'transparent'
                        return (
                            <tr style={{
                                backgroundColor: color
                            }}
                                key={user.name.first+user.name.last}>
                                <td>
                                    <img 
                                        src={user.picture.thumbnail} 
                                        alt={user.name.title} />
                                </td>
    
                                <td>{user.name.first}</td>
                                <td>{user.name.last}</td>
                                <td>{user.location.country}</td>
                                <td>
                                    <button onClick={()=> deleteUser(user.email)}>Eliminar</button>
                                </td>
    
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}