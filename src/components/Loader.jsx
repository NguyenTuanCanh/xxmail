import './Loader.css'
import animated  from '../assets/img/logo-wallet.svg'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getAuthorizedAccounts,connectAuthorizedAccounts } from '../utils/wallet'
import { isXxxigmNetWork, addNetWork, checkNetWork } from '../utils/contract'
import toast from 'react-hot-toast'

export default function Loader(props){

    const navigate = useNavigate()

    useEffect(()=>{
       
        const action = async () => {
            await isXxxigmNetWork() && getAuthorizedAccounts(props.setUser)
            if(props.user != ''){
                toast('Connected successfully')
            }
        }

        action()
        
    },[])

    useEffect(() => {
        setInterval(async() => {
            if(!await isXxxigmNetWork()) {
                props.setUser('')
            }
        }, 1000);
      }, [])

    return <motion.div className='Loader'>

        <motion.div
            initial    =  {{ y:-100,opacity:0}}
            animate    =  {{ y: 0  ,opacity:1 }}
            exit       =  {{ y:-100,opacity:0}}
            transition =  {{ type: 'spring',bounce:3,duration: 0.1,stiffness: 100,velocity: 6}}
        >
            <motion.img src={animated} width={220}/>
        </motion.div>

        {/* <motion.div 
            initial    =  {{ opacity:0}}
            animate    =  {{ opacity:1 }}
            exit       =  {{ opacity:0}}
            transition =  {{ delay: .8,type: 'spring',bounce:1,duration: 0.3,stiffness: 100,velocity: 6}}
            className='mediumSans logo-txt'>
            <motion.div
        
                className='darken'>
                Node
            </motion.div> 
            <motion.div
                transition =  {{ delay:.8,type: 'spring',bounce:1,duration: 0.3,stiffness: 100,velocity: 6}}
            > Mail
            </motion.div>
        </motion.div> */}
        <motion.p 
            initial    =  {{ opacity:0}}
            animate    =  {{ opacity:1 }}
            exit       =  {{ opacity:0}}
            transition =  {{ delay: .9}}
            className='sub'
        >Xmail DApp offers a user-self-hosted decentralized mailbox solution.</motion.p>
        <motion.button 
        initial    =  {{ opacity:0}}
        animate    =  {{ opacity:1 }}
        exit       =  {{ opacity:0}}
        transition =  {{ delay: 1}}
        onClick    =  {async()=>{
            if(props.user.trim().length == 0){
                const val = await isXxxigmNetWork()
                !val && await checkNetWork()
                connectAuthorizedAccounts(props.setUser)
            }else{
                props.refLoader.current.continuousStart()
                setTimeout(()=>{
                    props.refLoader.current.complete()
                    navigate('/mail')
                },4000)
            }
        }}
        className='connect mediumSans'>{props.user != ''?props.user.substring(0,4)+"..."+props.user.slice(-4):"Connect Wallet"}</motion.button>

    </motion.div>
}