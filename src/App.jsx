import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import './fonts.css'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Loader from './components/Loader'
import Home from './components/Home'
import { getAuthorizedAccounts } from './utils/wallet'
import { useEffect,useRef } from 'react'
import { isXxxigmNetWork, fetchArchiveSender, fetchInboxSender, fetchReadSender, fetchSentSender, fetchSpamSender, fetchStarredSender, fetchTrashSender, fetchUnreadSender } from './utils/contract'
import LoadingBar from 'react-top-loading-bar'
import toast, { Toaster } from 'react-hot-toast';
import Web3 from 'web3'
import CryptoJS from 'crypto-js'
import Signature from './components/Signature'
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip as ReactTooltip } from 'react-tooltip'

function generateColorFromAddress(address) {
  const hashInput = Web3.utils.toHex(address);
  const hash = CryptoJS.SHA256(hashInput).toString();
  const subset = hash.substring(0, 8);
  const integer = parseInt(subset, 16);
  const paddedHex = integer.toString(16).padStart(6, '0');
  const color = `#${paddedHex}`;
  return color;
}

function App() {

  const [user,setUser]         = useState('')
  const [inbox,setInbox]       = useState([])
  const [trash,setTrash]       = useState([])
  const [sent,setSent]         = useState([])
  const [unread,setUnread]     = useState([])
  const [read,setRead]         = useState([])
  const [spam,setSpam]         = useState([])
  const [archive,setArchive]   = useState([])
  const [star,setStar]   = useState([])


  const [color,setColor]       = useState(null)

  const [onSign,setOnSign]     = useState(false)
  const [progress,setProgress]                 = useState(0)
  const [onFetching,setOnFetching]             = useState(false)
  const [onFetchingTrash,setOnFetchingTrash]   = useState(false)
  const [onFetchingSent,setOnFetchingSent]     = useState(false)
  const [onFetchingUnread,setOnFetchingUnread] = useState(false)
  const [onFetchingRead,setOnFetchingRead]     = useState(false)



  const ref = useRef(null)

  const refreshInbox=async ()=>{

    setOnFetching(true)
    ref.current?.continuousStart()

    fetchInboxSender().then((v)=>{
      if(v!= undefined){setInbox(v)}
      setOnFetching(false)
      ref.current?.complete()
    }).catch((e)=>{
      setInbox([])
    })
  }

  const _refreshInbox=async ()=>{
    fetchInboxSender().then((v)=>{
      if(v!= undefined){setInbox(v)}
    }).catch((e)=>{
      setInbox([])
    })
  }


  const refreshTrash=async ()=>{

    setOnFetchingTrash(true)
    ref.current.continuousStart()

    fetchTrashSender().then((v)=>{
      setTrash(v)
      setOnFetchingTrash(false)
      ref.current.complete()
    })
  }

  const _refreshTrash=async ()=>{
    fetchTrashSender().then((v)=>{
      setTrash(v)
    })
  }


  const refreshSent=async ()=>{

    setOnFetchingSent(true)
    ref.current.continuousStart()

    fetchSentSender().then((v)=>{
      setSent(v)
      setOnFetchingSent(false)
      ref.current.complete()
    })
  }


  const _refreshSent=async ()=>{
    fetchSentSender().then((v)=>{
      setSent(v)
    })
  }


  const refreshUnread=async ()=>{

    setOnFetchingUnread(true)
    ref.current.continuousStart()

    fetchUnreadSender().then((v)=>{
      setUnread(v)
      setOnFetchingUnread(false)
      ref.current.complete()
    })
  }

  const _refreshUnread=async ()=>{
    fetchUnreadSender().then((v)=>{
      setUnread(v)
    })
  }

  const refreshRead=async ()=>{

    setOnFetchingRead(true)
    ref.current.continuousStart()

    fetchReadSender().then((v)=>{
      setRead(v)
      setOnFetchingRead(false)
      ref.current.complete()
    })
  }

  const _refreshRead=async ()=>{
    fetchReadSender().then((v)=>{
      setRead(v)
    })
  }

  const refreshSpam=async ()=>{

    ref.current.continuousStart()

    fetchSpamSender().then((v)=>{
      setSpam(v)
      ref.current.complete()
    })
  }

  const _refreshSpam=async ()=>{
    fetchSpamSender().then((v)=>{
      setSpam(v)
    })
  }

  const refreshArchive=async ()=>{

    ref.current.continuousStart()

    fetchArchiveSender().then((v)=>{
      setArchive(v)
      ref.current.complete()
    })
  }

  const _refreshArchive=async ()=>{
    fetchArchiveSender().then((v)=>{
      setArchive(v)
    })
  }

  const refreshStar=async ()=>{

    ref.current.continuousStart()

    fetchStarredSender().then((v)=>{
      setStar(v)
      ref.current.complete()
    })
  }

  const _refreshStar=async ()=>{
    fetchStarredSender().then((v)=>{
      setStar(v)
    })
  }

  useEffect(() => {
    const myInterval = setInterval(async() => {
      if(await isXxxigmNetWork() && user) {
        _refreshInbox()
        _refreshTrash()
        _refreshSent()
        _refreshUnread()
        _refreshRead()
        _refreshSpam()
        _refreshArchive()
        _refreshStar()
      } else {
        clearInterval(myInterval)
      }
    }, 1000);
  }, [user])

  useEffect(()=>{
    if(user.trim().length != 0){
      refreshInbox()
    }

  },[user])

  useEffect(()=>{ 
    const action = async() => {
      if(await isXxxigmNetWork()) {
        getAuthorizedAccounts(setUser)
      } else {
        setUser('')
      }
    }

    action()
  } ,[])
  return (
    <div className="App">
      {onSign && <Signature/>}
      <LoadingBar  progress={progress} color='#FA543E' onLoaderFinished={() => setProgress(0)} ref={ref}/>
      <Toaster 
        position='center-bottom'
        toastOptions={{
          style: {
            padding: '11px',
            background:"#272727",
            color: 'white',
            fontFamily:"GoogleSansRegular",
            borderRadius:'4px',
            marginBottom: "6px",
          },
          className: 'toast',
        }}
      />
      <ReactTooltip
        anchorId="info-app"
        place="bottom"
        content="Decentralized Gmail"
      />
       <ReactTooltip
        anchorId="info-contract"
        place="bottom"
        content="Live on Xxxigm testnet"
      />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Loader refLoader={ref} user={user} setUser={setUser}/>}/>
          <Route path="/mail" element={
          <Home 

            /**Loading state */
            onFetching      = {onFetching} 
            OnFetchingTrash = {onFetchingTrash}
            /**refresher */
            refreshInbox   = {refreshInbox} 
            refreshTrash   = {refreshTrash}
            refreshSent    = {refreshSent}
            refreshUnread  = {refreshUnread}
            refreshRead    = {refreshRead}
            refreshSpam    = {refreshSpam}
            refreshArchive = {refreshArchive}
            refreshStar    = {refreshStar}
            /**Loading bar contoller */
            LoaderRef    = {ref} 
            /**data getter*/
            user         = {user} 
            inbox        = {inbox}
            trash        = {trash}
            sent         = {sent}
            unread       = {unread}
            read         = {read}
            color        = {color}
            spam         = {spam}
            archive      = {archive}
            onSign       = {onSign}
            star         = {star}
            /**data setter*/
            setTrash     = {setTrash}
            setSent      = {setSent}
            setOnSign    = {setOnSign}
            setUser      = {setUser}

          />
          }/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
