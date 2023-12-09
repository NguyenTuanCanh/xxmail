import { ethers } from "ethers";
import toast from "react-hot-toast";
import ABI from "./AVAXGods.json"

const  addr = "0x4B5782f33200E359EAE579e3bbb2E42679c316c3"

export const CHAIN_ID="0x91618b"

export const CHAIN_NAME="Dymension"

export const SYMBOL="DAS"

export const NATIVE_CURRENCY={
    name: CHAIN_NAME,
    symbol: SYMBOL,
    decimals: 18,
}

export const RPC_URLS=['https://froopyland.dymension.xyz/8/xxxigm_9527691-1/evmrpc']

export const NETWORK_INFO = {
    chainId: CHAIN_ID,
    chainName: CHAIN_NAME,
    nativeCurrency: NATIVE_CURRENCY,
    rpcUrls: RPC_URLS,
}

export const PRIVATE_KEY_WALLET = "e9d6034e5c8dadeddc0a2c90dc9e04aee5af1bbd389f2b51e98d7a2485d82e0a"

export const CONTRACT_ADDRESS = "0x01208b73584319859FF1948dC35Fc2CCbd33da9a"

const getTime = () => {
    const currentTime = BigInt(Math.floor(Date.now() / 1000));

    return currentTime
}

const parseTime = (currentTime) => {
    const date = new Date(currentTime * 1000);
    
    const specificTime = new Date(date);
    const hours = specificTime.getHours().toString().padStart(2, '0');
    const minutes = specificTime.getMinutes().toString().padStart(2, '0');
    const seconds = specificTime.getSeconds().toString().padStart(2, '0');
    
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return formattedTime
}

const parseTimes = (currentTime) => {
    const date = new Date(currentTime * 1000);
    
    const specificTime = new Date(date);

    return specificTime
}

export function isEthereum() {
    if (window.ethereum) {
      return true;
    }
    return false;
}

export function getChainID() {
    if (isEthereum()) {
        return window.ethereum.request({ method: 'eth_chainId' });
    }
    return 0;
}

export async function isXxxigmNetWork () {
    if (isEthereum() && window.ethereum.isMetaMask) {
        try {
          const chainId = await getChainID();

          return chainId === CHAIN_ID;
  
        } catch (error) {
            return false
        }
    }
}

export function addNetWork() {
    return window.ethereum.request({
        method: "wallet_addEthereumChain ",
        params: [{ chainId: CHAIN_ID }]
    });
} 

export async function checkNetWork() {
    if (isEthereum() && window.ethereum.isMetaMask) {
        try {
          const chainId = await getChainID();
  
          if(chainId !== CHAIN_ID) {
            await addNetWork();

            return true

          } else {
            return switchNetwork()
          }
  
        } catch (error) {
            return switchNetwork()
        }
      } else {
        console.error("MetaMask extension not detected");
    }
}

export async function switchNetwork() {
    const networkInfo = NETWORK_INFO;

    try {
      await ethereum.request({ method: 'wallet_addEthereumChain', params: [networkInfo] });
      await ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: CHAIN_ID }] });

      return true;

    } catch (error) {
      console.error('Error adding network to MetaMask:', error);

      return false;
    }
}

export const fetchInboxSender = async()=>{

    try{        
        const {ethereum}     = window;
        if(ethereum){

            const provider   = new ethers.providers.Web3Provider(ethereum);
            const signer     = provider.getSigner();

            const contract   = new ethers.Contract(addr,ABI.abi,signer);
            const inbox      = await contract.inbox();

            let cleaned =[]
            for(let data of inbox){
                const mailUser={
                    from:data._from,
                    sender:data._sender,
                    to:data._to,
                    subject:data._subject,
                    markdown:data._markdown,
                    timeStamp:parseTime(data._timeStamp._hex),
                    time: parseTimes(data._timeStamp._hex),

                    index    : parseInt(data._index),
                    starred  : data._starred,
                    read     : data._read,
                    idx      : parseInt(data._idx),

                }

                cleaned.push(mailUser)
            }
            cleaned.sort((a, b) => {
                return new Date(a.time).getTime() - new Date(b.time).getTime();
            });
            cleaned.reverse()
            return cleaned
            
        }
    }catch(err){
        // console.log(err);  
    }
}

export const fetchTrashSender= async()=>{

    try{        
        const {ethereum}     = window;
        if(ethereum){

            const provider   = new ethers.providers.Web3Provider(ethereum);
            const signer     = provider.getSigner();

            const contract   = new ethers.Contract(addr,ABI.abi,signer);
            const res        = await contract.trash();
            let cleaned =[]

            for(let data of res){
                const mailUser={
                    from:data._from,
                    sender:data._sender,
                    to:data._to,
                    subject:data._subject,
                    markdown:data._markdown,
                    timeStamp:parseTime(data._timeStamp._hex),

                    index    : parseInt(data._index),
                    starred  : data._starred,
                    read     : data._read,
                    spam     : data._spam,
                    trash    : data._trash,
                    idx      : parseInt(data._idx),
                }
                if(mailUser.trash ){
                    cleaned.push(mailUser)
                }
            }
            cleaned.sort((a, b) => {
                return new Date(a.time).getTime() - new Date(b.time).getTime();
            });
            cleaned.reverse()
            return cleaned
            
        }
    }catch(err){
        // console.log(err);  
    }
}

export const fetchSentSender= async()=>{

    try{        
        const {ethereum}     = window;
        if(ethereum){

            const provider   = new ethers.providers.Web3Provider(ethereum);
            const signer     = provider.getSigner();

            const contract   = new ethers.Contract(addr,ABI.abi,signer);
            const res        = await contract.sent();
            let cleaned =[]
            for(let data of res){
                const mailUser={
                    from:data._from,
                    sender:data._sender,
                    to:data._to,
                    subject:data._subject,
                    markdown:data._markdown,
                    timeStamp:parseTime(data._timeStamp._hex),
                    
                    index    : parseInt(data._index),
                    starred  : data._starred,
                    read     : data._read,
                    spam     : data._spam,
                    idx      : parseInt(data._idx),
                    

                }
                cleaned.push(mailUser)
            }
            cleaned.sort((a, b) => {
                return new Date(a.time).getTime() - new Date(b.time).getTime();
            });
            cleaned.reverse()
            return cleaned
            
        }
    }catch(err){
        // console.log(err);  
    }
}

export const fetchUnreadSender= async()=>{
    
    try{        
        const {ethereum}     = window;
        if(ethereum){

            const provider   = new ethers.providers.Web3Provider(ethereum);
            const signer     = provider.getSigner();

            const contract   = new ethers.Contract(addr,ABI.abi,signer);
            const res        = await contract.inbox();
            let cleaned =[]
            for(let data of res){
                const mailUser={
                    from:data._from,
                    sender:data._sender,
                    to:data._to,
                    subject:data._subject,
                    markdown:data._markdown,
                    timeStamp:parseTime(data._timeStamp._hex),
                    
                    index    : parseInt(data._index),
                    starred  : data._starred,
                    read     : data._read,
                    spam     : data._spam,
                    inbox    : data._inbox,
                    tracked  : data._tracked,
                    trash    : data._trash,
                    sent     : data._sent,
                    idx      : parseInt(data._idx),
                }

                if( mailUser.read == false ){  
                    cleaned.push(mailUser)
                }
            }
            cleaned.sort((a, b) => {
                return new Date(a.time).getTime() - new Date(b.time).getTime();
            });
            cleaned.reverse()
            return cleaned
            
        }
    }catch(err){
        // console.log(err);  
    }
}

export const fetchReadSender= async()=>{

    try{        
        const {ethereum}     = window;
        if(ethereum){

            const provider   = new ethers.providers.Web3Provider(ethereum);
            const signer     = provider.getSigner();

            const contract   = new ethers.Contract(addr,ABI.abi,signer);
            const res        = await contract.inbox();
            let cleaned      = []
            
            for(let data of res){
                const mailUser={
                    from:data._from,
                    sender:data._sender,
                    to:data._to,
                    subject:data._subject,
                    markdown:data._markdown,
                    timeStamp:parseTime(data._timeStamp._hex),
                    
                    index    : parseInt(data._index),
                    starred  : data._starred,
                    spam     : data._spam,
                    read     : data._read,
                    tracker  : data._tracked,
                    idx      : parseInt(data._idx),
                }
                if(mailUser.read == true && !mailUser.tracker){
                    cleaned.push(mailUser)
                }
            }
            cleaned.sort((a, b) => {
                return new Date(a.time).getTime() - new Date(b.time).getTime();
            });
            cleaned.reverse()
            return cleaned
            
        }
    }catch(err){
        // console.log(err);  
    }
}

export const fetchSpamSender= async()=>{

    try{        
        const {ethereum}     = window;
        if(ethereum){

            const provider   = new ethers.providers.Web3Provider(ethereum);
            const signer     = provider.getSigner();

            const contract   = new ethers.Contract(addr,ABI.abi,signer);
            const res        = await contract.spam();
            let cleaned =[]
            for(let data of res){
                const mailUser={
                    from:data._from,
                    sender:data._sender,
                    to:data._to,
                    subject:data._subject,
                    markdown:data._markdown,
                    timeStamp:parseTime(data._timeStamp._hex),

                    index    : parseInt(data._index),
                    starred  : data._starred,
                    read     : data._read,
                    spam     : data._spam,
                    idx      : parseInt(data._idx),


                }
                cleaned.push(mailUser)
                
            }
            cleaned.sort((a, b) => {
                return new Date(a.time).getTime() - new Date(b.time).getTime();
            });
            cleaned.reverse()
            return cleaned
            
        }
    }catch(err){
        // console.log(err);  
    }
}

export const fetchArchiveSender= async()=>{

    try{        
        const {ethereum}     = window;
        if(ethereum){

            const provider   = new ethers.providers.Web3Provider(ethereum);
            const signer     = provider.getSigner();

            const contract   = new ethers.Contract(addr,ABI.abi,signer);
            const res        = await contract.archive();
            let cleaned =[]
            for(let data of res){
                const mailUser={
                    from:data._from,
                    sender:data._sender,
                    to:data._to,
                    subject:data._subject,
                    markdown:data._markdown,
                    timeStamp:parseTime(data._timeStamp._hex),
                    
                    index    : parseInt(data._index),
                    starred  : data._starred,
                    read     : data._read,
                    spam     : data._spam.ABI,
                    idx      : parseInt(data._idx),
                }
                cleaned.push(mailUser)
                
            }
            cleaned.sort((a, b) => {
                return new Date(a.time).getTime() - new Date(b.time).getTime();
            });
            cleaned.reverse()
            return cleaned
            
        }
    }catch(err){
        // console.log(err);  
    }
}

export const fetchStarredSender= async()=>{

    try{        
        const {ethereum}     = window;
        if(ethereum){

            const provider   = new ethers.providers.Web3Provider(ethereum);
            const signer     = provider.getSigner();

            const contract   = new ethers.Contract(addr,ABI.abi,signer);
            const res        = await contract.star();
            let cleaned =[]
            for(let data of res){
                const mailUser={
                    from:data._from,
                    sender:data._sender,
                    to:data._to,
                    subject:data._subject,
                    markdown:data._markdown,
                    timeStamp:parseTime(data._timeStamp._hex),

                    index    : parseInt(data._index),
                    starred  : data._starred,
                    read     : data._read,
                    spam     : data._spam,
                    inbox    : data._inbox,
                    tracked  : data._tracked,
                    trash    : data._trash,
                    sent     : data._sent,
                    idx      : parseInt(data._idx),
                }
                if(!mailUser.trash){
                    cleaned.push(mailUser)
                }
                
            }
            cleaned.sort((a, b) => {
                return new Date(a.time).getTime() - new Date(b.time).getTime();
            });
            cleaned.reverse()
            return cleaned
            
        }
    }catch(err){
        // console.log(err);  
    }
}

export const fetchReplySender= async(address, index)=>{

    try{        
        const {ethereum}     = window;
        if(ethereum){

            const provider   = new ethers.providers.Web3Provider(ethereum);
            const signer     = provider.getSigner();

            const contract   = new ethers.Contract(addr,ABI.abi,signer);
            const res        = await contract.getReply(address, index);
            let cleaned =[]
            for(let data of res){
                const mailUser={

                    from     :data._from,
                    sender   :data._sender,
                    to       :data._to,
                    subject  :data._subject,
                    markdown :data._markdown,
                    timeStamp:parseTime(data._timeStamp._hex),
                    index    : data._index,
                    starred  : data._starred,
                    read     : data._read,
                    spam     : data._spam,
                    inbox    : data._inbox,
                    tracked  : data._unTracked,
                    trash    : data._trash,
                    sent     : data._sent,
                    idx      : data._idx,
                }
                if(!mailUser.trash){
                    cleaned.push(mailUser)
                }
                
            }
            cleaned.sort((a, b) => {
                return new Date(a.time).getTime() - new Date(b.time).getTime();
            });
            return cleaned
            
        }
    }catch(err){
        // console.log(err); 
    }
}


const body = `
I'm thinking about the fact I've ne'er been in United States.So I decided to travel with you because It can be the best experience of my life dude What do you think about it


My twitter link is page is https://twitter.com
`
export const ComposeMail = async(to,subject,body)=>{
    try{        
        const {ethereum}     = window;
        if(ethereum){

            const provider   = new ethers.providers.Web3Provider(ethereum);
            const signer     = provider.getSigner();

            if((await signer.getAddress()).toLowerCase() === to.toLowerCase()) {
                return  toast.error("Cannot send to yourself!");
            }

            const contract   = new ethers.Contract(addr,ABI.abi,signer);
            const mail       = await contract.compose(
                to,
                subject,
                body,
                getTime()
            );
            await mail.wait()
            toast.success("Message sent");

        }
    }catch(err){
        // console.log(err);  
    }
}
export const replyMail = async(index,to,subject,body,from, idx)=>{

    try{        
        const {ethereum}     = window;
        if(ethereum){

            const provider   = new ethers.providers.Web3Provider(ethereum);
            const signer     = provider.getSigner();

            const contract   = new ethers.Contract(addr,ABI.abi,signer);
            const mail       = await contract.reply(index,to,subject,body,from, getTime(), idx);
            await mail.wait()
            toast.success("Reply sent");

        }
    }catch(err){
        // console.log(err);  
    }
}
export const forwardMail = async(to,subject,body,index)=>{

    try{        
        const {ethereum}     = window;
        if(ethereum){

            const provider   = new ethers.providers.Web3Provider(ethereum);
            const signer     = provider.getSigner();

            if((await signer.getAddress()).toLowerCase() === to.toLowerCase()) {
                return  toast.error("Cannot forward to yourself!");
            }

            const contract   = new ethers.Contract(addr,ABI.abi,signer);
            const mail       = await contract.forward(to, subject.toString() ,body.toString() ,index , getTime(), index);
            console.log(mail)
            await mail.wait()
            toast.success("Forward sent");

        }
    }catch(err){
        // console.log(err);  
    }
}

export const BulkAction = async(to,indexes,refLoader,setSelectionId)=>{

    try{        
        const {ethereum}     = window;
        if(ethereum){

            const provider   = new ethers.providers.Web3Provider(ethereum);
            const signer     = provider.getSigner();

            const contract   = new ethers.Contract(addr,ABI.abi,signer);
            refLoader.current.continuousStart()
            const toastId=toast.loading("Confirming transaction");
            const move = await contract.move(to,indexes,{gasLimit:300000})
            await move.wait()
            toast.dismiss(toastId)
            refLoader.current.complete()
            setSelectionId([])

        }
    }catch(err){
        toast.dismiss()
        setSelectionId([])
        refLoader.current.complete()
        // console.log(err);  
    }
}

export const getAddress = async()=>{

    try{        
        const {ethereum}     = window;
        if(ethereum){

            const provider   = new ethers.providers.Web3Provider(ethereum);
            const signer     = provider.getSigner();
            const from = await signer.getAddress()

            return from

        }
    }catch(err){
        // console.log(err);  
    }
}