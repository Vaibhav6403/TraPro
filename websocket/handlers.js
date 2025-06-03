const Message = require('../models/Message')
const Group = require('../models/Group')
const WebSocket = require('ws');

exports.handleMessage = async (ws,data,clients)=>{
    const userId = ws.user.id;
    console.log(userId)
    const dataToCheck = JSON.parse(data.toString());
    if(dataToCheck.type = 'group_chat'){
      const {content,groupName} = JSON.parse(data.toString());
      const group = await Group.findOne({ name: groupName });
      console.log("the group is",group)
      if (!group) {
        return ws.send(JSON.stringify({ error: 'Group not found' }));
      }
      else{
        
        group.members.forEach((member)=>{
          if(member._id.toString() != userId){
            const memberGc = clients.get(member._id.toString() );
            console.log("the member is ready state", memberGc.readyState )
             if (memberGc && memberGc.readyState === WebSocket.OPEN) {
              memberGc.send(JSON.stringify({
                            type: 'group_chat',
                            groupId: group._id,
                            from: userId,
                            content: content,
                            timestamp: new Date().toISOString()
                          }))
             }
          }
        })
      }
    }
    else{
      const {content,receiverId} = JSON.parse(data.toString());
      const receiverSocket = clients.get(receiverId);
      console.log("receivers socket",receiverSocket)
      if(receiverSocket){
      receiverSocket.send(
        JSON.stringify({
        from: userId,
        content: content,
        timestamp: new Date().toISOString()
      })
      )   
      const msg = new Message(
        {
        sender:ws.user.id,
        receiver:receiverId,
        content:content
        }
      )
      msg.save()
      }
      else{
        console.log('the user is offline')
      }
    } 
}