import net from "node:net";

export function connectUdsController({socketPath,protocolVersion,connectTimeoutMs=2000}){
  return new Promise((resolve,reject)=>{
    const socket=net.createConnection({path:socketPath});
    let buffer="",sequence=0,closed=false;const pending=new Map();
    const fail=error=>{closed=true;for(const entry of pending.values())entry.reject(error);pending.clear();};
    const timer=setTimeout(()=>socket.destroy(new Error("Controller connection timeout")),connectTimeoutMs);
    socket.setEncoding("utf8");socket.on("error",fail);socket.on("close",()=>fail(new Error("Controller connection closed")));
    socket.on("data",chunk=>{buffer+=chunk;if(buffer.length>1048576){socket.destroy(new Error("Controller frame limit exceeded"));return;}for(;;){const nl=buffer.indexOf("\n");if(nl<0)break;const line=buffer.slice(0,nl);buffer=buffer.slice(nl+1);let frame;try{frame=JSON.parse(line);}catch{socket.destroy(new Error("invalid Controller response"));return;}const entry=pending.get(frame.id);if(!entry)continue;pending.delete(frame.id);frame.ok===true?entry.resolve(frame.result):entry.reject(new Error(frame.error?.message??"Controller denied request"));}});
    socket.once("connect",()=>{clearTimeout(timer);resolve({isOpen:()=>!closed&&!socket.destroyed,request(message){if(closed||socket.destroyed)return Promise.reject(new Error("Controller connection unavailable"));const id=++sequence;return new Promise((resolveRequest,rejectRequest)=>{pending.set(id,{resolve:resolveRequest,reject:rejectRequest});socket.write(`${JSON.stringify({v:protocolVersion,id,message})}\n`,error=>{if(error){pending.delete(id);rejectRequest(error);}});});},close(){if(closed)return;closed=true;socket.destroy();}});});
  });
}
