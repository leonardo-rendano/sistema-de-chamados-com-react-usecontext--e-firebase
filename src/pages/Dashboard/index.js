import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

import firebase from '../../services/firebaseConnections'

import Header from '../../components/Header'
import Title from '../../components/Title'

import './dashboard.css'
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi'

const listRef = firebase.firestore().collection('chamados').orderBy('created', 'desc')

export default function Dashboard() {

  const [chamados, setChamados] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)
  const [lastDoc, setLastDocs] = useState()

  useEffect(() => {

    loadChamados()

    return () => {}
  }, [])

  async function loadChamados() {
    await listRef.limit(5)
    .get()
    .then((snapshot) => {
      updateState(snapshot)
    }) 
    .catch(error => {
      console.log(error)
      setLoadingMore(false)
    })

    setLoading(false)
  }

  async function updateState(snapshot) {
    const isCollectionEmpty = snapshot.size === 0

    if (!isCollectionEmpty) {
      let lista = []

      snapshot.forEach(doc => {
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().id,
          created: doc.data().created,
          createFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
          status: doc.data().status,
          complemento: doc.data().complemento
        })
      })

      const lastDoc = snapshot.docs[snapshot.docs.length - 1]

      setChamados(chamados => [...chamados, ...lista])
      setLastDocs(lastDoc)

    } else {
      setIsEmpty(true)
    }

    setLoadingMore(false)
  }

  async function handleMore() {
    setLoadingMore(true)
    await listRef.startAfter(lastDoc).limit(5).get()
    .then((snapshot) => {
      updateState(snapshot)
    })
  }

  if (loading) {
    return(
      <div>
        <Header />
       
        <div className="content">
          <Title name="Atendimentos">
            <FiMessageSquare size={25} />
          </Title>

          <div className="container dashboard">
            <span>Buscando chamados...</span>
          </div>
        </div>
      </div>
    )
  }


 return (
   <div>
     <Header />
       
       <div className="content">
         <Title name="Atendimentos">
          <FiMessageSquare size={25} />
         </Title>

         {chamados.length === 0 ? (
          <div className="container dashboard">
            <span>Nenhum chamado registrado...</span>
              <Link to="/new" className="new">
                <FiPlus size={25} color="#fff"  />
                Novo chamado
              </Link>
           </div>
         ) : (
           <>
            <Link to="/new" className="new">
                <FiPlus size={25} color="#fff"  />
                Novo chamado
              </Link>

              <table>
                <thead>
                  <tr>
                    <th scope="col">Cliente</th>
                    <th scope="col">Assunto</th>
                    <th scope="col">Status</th>
                    <th scope="col">Cadastrado em</th>
                    <th scope="col">#</th>
                  </tr>
                </thead>
                <tbody>
                  {chamados.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td data-label="Cliente">{item.cliente}</td>
                        <td data-label="Assunto">{item.assunto}</td>
                        <td data-label="Status">
                          <span className="badge" style={{backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999'}}>{item.status}</span>
                        </td>
                        <td data-label="Cadastrado">{item.createFormated}</td>
                        <td data-label="#" >
                          <button style={{backgroundColor: '#3583f6'}} className="action" >
                            <FiSearch color="#FFF" size={17} />
                          </button>

                          <button style={{backgroundColor: '#f6a935'}} className="action" >
                            <FiEdit2 color="#FFF" size={17} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                  
                </tbody>
              </table>

              {loadingMore && <h3 style={{textAlign: 'center', marginTop: 15}} >Buscando chamados...</h3>}
              

              { !loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar mais</button>}
           </>
         )}

         
       </div>
   </div>
 );
}