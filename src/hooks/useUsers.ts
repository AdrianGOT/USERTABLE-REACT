import { useEffect, useRef, useState, } from 'react'
import { ListOfUsers, ResultOfUser, User } from '../interfaces/user';
import { queryOptions, useInfiniteQuery, useQuery } from '@tanstack/react-query';


const fetchFunction = (page: number) => {
    const params = new URLSearchParams({
        'seed'    : 'coshi',
        'results' : '10',
        'page'    : `${page}`
    })

    return fetch(`https://randomuser.me/api/?${params}`)
        .then(res => {
            // console.log(res.ok, res.status, res.statusText); <= verdadera manera de manejar los errores con fetch! 
            if(!res.ok) throw new Error('there is an error') 
            return res.json()
        })
        .then((data: ResultOfUser) => {
            return{
                users: data.results,
                nextCursor: data.info.page + 1
            }
        });
}

export const useUsers = () => {
    const {isLoading, isError, data } = useInfiniteQuery<{users: User[], nextCursor: number}>({
        queryKey: ['users'],
        getNextPageParam: (lastPage, page) => lastPage.nextCursor,
        initialPageParam: 1
    })

    const [currentPage, setCurrentPage] = useState(1);
    // const [loading, setLoading] = useState(false);
    // const [users, setUsers] = useState<ListOfUsers>([]);
    // const [err, setError] = useState('');
    const originalUsers = useRef<ListOfUsers>([]);

    // useEffect(()=> {
    //     // setLoading(true);
    //     // setError('');

  

    //     fetchFunction(currentPage)
    //         .then(data => {
    //             setUsers(prevUsers => prevUsers.concat(data.results));
    //             originalUsers.current = data.results;
    //         })
    //         .catch(err => {
    //             console.log(err)
    //             // setError(err);
    //         })
    //         .finally(()=> {
    //             // setLoading(false);
    //         })
        
    //   }, [currentPage]);

    return {
        users: data,
        // setUsers,
        setCurrentPage, 
        originalUsers,
        currentPage,
        loading: isLoading,
        err: isError, 
    }
}