/**
 * @name Unghost
 * @description Allows you to see the members of each role on a server.
 * @version 0.0.1
 * @author Mark123
 * @authorId 249746236008169473
 * @website https://github.com/Mark123M/unghost
 */
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/
const config = {
    info: {
        name: "Unghost",
        authors: [
            {
                name: "Mark123",
                github_username: "Mark123",
            }
        ],
        version: "0.0.1",
        description: "Notifies you if you have ghosted someone.",
        github: "https://github.com/Mark123M/unghost",
    },
    defaultConfig: [
      {
          type: "switch",
          id: "showReminders",
          name: "Show Reminders",
          note: "Turning this on would show reminders",
          value: true
      },
      {
          type: "textbox",
          id: "reminderInterval",
          name: "Reminder Interval",
          note: "Set the time interval (in minutes) between each reminder",
          value: 30
      } 
    ],
    changelog: [
      {
          title: "Deployment",
          type: "fixed",
          items: [
          "It works?",      
          ]
        }
    ],
    main: "index.js"
  };
  
  module.exports = !global.ZeresPluginLibrary ?
  class {
    constructor() {
        this._config = config;
        
    }
  
    load() {
        BdApi.showConfirmationModal('Library plugin is needed',
            `The library plugin needed for AQWERT'sPluginBuilder is missing. Please click Download Now to install it.`, {
            confirmText: 'Download',
            cancelText: 'Cancel',
            onConfirm: () => {
                request.get('https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js', (error, response, body) => {
                    if (error)
                        return electron.shell.openExternal('https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js');
  
                    fs.writeFileSync(path.join(BdApi.Plugins.folder, '0PluginLibrary.plugin.js'), body);
                });
            }
        });
    }
  
    start() { }
  
    stop() { }
  }
   : (([Plugin, Api]) => {
     const plugin = (Plugin, Api) => {
    const {DOM, ContextMenu, Patcher, Webpack, UI, Utils} = window.BdApi;
    const {DiscordModules, DiscordSelectors, Utilities, Popouts, Modals} = Api;
  
    const from = arr => arr && arr.length > 0 && Object.assign(...arr.map(([k, v]) => ({[k]: v})));
    const filter = (obj, predicate) => from(Object.entries(obj).filter((o) => {return predicate(o[1]);}));
  
    const SelectedGuildStore = DiscordModules.SelectedGuildStore;
    const GuildStore = DiscordModules.GuildStore;
    const GuildMemberStore = DiscordModules.GuildMemberStore;
    const UserStore = DiscordModules.UserStore;
    const ImageResolver = DiscordModules.ImageResolver;
  
    const RelationshipStore = DiscordModules.RelationshipStore;
    const MessageStore = DiscordModules.MessageStore;
    const MessageActions = DiscordModules.MessageActions;
    const ChannelStore = DiscordModules.ChannelStore;
    const SelectedChannelStore = DiscordModules.SelectedChannelStore;
  
    const allDMChannels = RelationshipStore.getFriendIDs().map(id => ChannelStore.getDMFromUserId(id))
    //console.log(allDMChannels)
  
    let allGhosted = [];
   // const ReadStateStore = DiscordModules.ReadStateStore
   /* console.log(RelationshipStore.getFriendIDs(), 'friendids');
    console.log(UserStore.getUser(RelationshipStore.getFriendIDs()[100]), 'get one user')
    console.log(UserStore.getCurrentUser(), 'myself')
  
    const friend = RelationshipStore.getFriendIDs()[100]
    const DMId = ChannelStore.getDMFromUserId(friend)
    console.log(friend, DMId)
    console.log(MessageStore.getMessages(DMId)) */
  
    //console.log(SelectedChannelStore.getLastSelectedChannelId(), 'last channel id')
   // console.log(MessageStore.getMessages(SelectedChannelStore.getLastSelectedChannelId()));
  
    BdApi.saveData('Unghost', 'data1', 'penispeople')
    console.log(BdApi.loadData('Unghost', 'data1')) //LETS FUCKING GOOOO IT WORKS 
  
  //  BdApi.saveData('Unghost', 'ghosted', [])
    
  
    //ReadStateStore.lastMessageId(channelId)
  
    //console.log(BdApi.findModuleByProps("lastMessageId") , 'sduijsud')
  
    //LAST SELECTED CHANNEL ID WORKS LETS FUCKING GOOOOOO
  
    //console.log(UserStore, 'dsuifhsduifhuisdhfuisdhuifhsd')
      //console.log(MessageStore.getMessages("56065988331843584"), 'messakges');
  
    const popoutHTML = `<div class="layer-2aCOJ3" style="z-index: 100">
  <div class="animatorBottom-L63-7D translate-PeW1wK didRender-2SiRlm popout-role-members" style="margin-top: 0;">
    <div class="container-2O1UgZ role-members-popout">
        <div class="container-2oNtJn medium-2NClDM">
            <div class="inner-2pOSmK"><input class="input-2m5SfJ" placeholder="Search Members — {{memberCount}}" value="">
                <div tabindex="0" class="iconLayout-3Bjizv medium-2NClDM" role="button">
                    <div class="iconContainer-6pgShY">
                        <svg name="Search" class="icon-3CDcPB visible-CwPfRb" width="18" height="18" viewBox="0 0 18 18"><g fill="none" fill-rule="evenodd"><path fill="currentColor" d="M3.60091481,7.20297313 C3.60091481,5.20983419 5.20983419,3.60091481 7.20297313,3.60091481 C9.19611206,3.60091481 10.8050314,5.20983419 10.8050314,7.20297313 C10.8050314,9.19611206 9.19611206,10.8050314 7.20297313,10.8050314 C5.20983419,10.8050314 3.60091481,9.19611206 3.60091481,7.20297313 Z M12.0057176,10.8050314 L11.3733562,10.8050314 L11.1492281,10.5889079 C11.9336764,9.67638651 12.4059463,8.49170955 12.4059463,7.20297313 C12.4059463,4.32933105 10.0766152,2 7.20297313,2 C4.32933105,2 2,4.32933105 2,7.20297313 C2,10.0766152 4.32933105,12.4059463 7.20297313,12.4059463 C8.49170955,12.4059463 9.67638651,11.9336764 10.5889079,11.1492281 L10.8050314,11.3733562 L10.8050314,12.0057176 L14.8073185,16 L16,14.8073185 L12.2102538,11.0099776 L12.0057176,10.8050314 Z"></path></g></svg>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div class="list-3cyRKU none-2-_0dP scrollerBase-_bVAAt role-members" dir="ltr" style="overflow: hidden scroll; padding-right: 0px; max-height: 400px;">
                
            </div>
        </div>
    </div>
  </div>
  </div>`;
    const itemHTML = `<div class="item-1BCeuB role-member">
    <div class="itemCheckbox-2G8-Td">
        <div class="avatar-1XUb0A wrapper-1VLyxH" role="img" aria-hidden="false" style="width: 32px; height: 32px;">
            <svg width="40" height="32" viewBox="0 0 40 32" class="mask-1FEkla svg-2azL_l" aria-hidden="true">
                <foreignObject x="0" y="0" width="32" height="32" mask="url(#svg-mask-avatar-default)">
                        <div class="avatarStack-3vfSFa">
                            <img src="{{avatar_url}}" alt=" " class="avatar-b5OQ1N" aria-hidden="true">
                        </div>
                </foreignObject>
            </svg>
        </div>
    </div>
    <div class="itemLabel-27pirQ">
        <span class="username">{{username}}</span><span class="discriminator-2jnrqC">{{discriminator}}</span>
    </div>
  </div>`;
  
    return class RoleMembers extends Plugin {
  
        onStart() {
            this.patchRoleMention(); // <@&367344340231782410>
            this.patchGuildContextMenu();
  
            allGhosted = BdApi.loadData('Unghost', 'ghosted') === undefined ? [] : BdApi.loadData('Unghost', 'ghosted');  //load all previously saved reminders
            setInterval(()=>{
             /* const display = allGhosted.map(g=>{document.createElement(
                  `<div style = "width: 200px; height: 40px; color: white;">
                      ${g[1]}
                   </div>
                  `)
              }) */
              console.log(allGhosted)
              Modals.showModal("Remember to respond!", allGhosted,
              {danger: false, confirmText: "Okay", cancelText: "Cancel"})
  
            }, 10000)
        }
  
        onStop() {
            BdApi.saveData('Unghost', 'ghosted', allGhosted)
            const elements = document.querySelectorAll(".popout-role-members");
            for (const el of elements) el && el.remove();
            Patcher.unpatchAll(this.name);
            this.contextMenuPatch?.();
        }
        
        onSwitch(){
          const lastChannelId = SelectedChannelStore.getLastSelectedChannelId()
          console.log(ChannelStore.getChannel(lastChannelId), 'lastchannel')
         // console.log('switched channels to:', lastChannelId, allDMChannels.includes(lastChannelId)? 'is a dm': 'is not a dm')
       //   console.log('switched channels to:', lastChannelId, allDMChannels.includes(lastChannelId)? 'is a dm': 'is not a dm')
          
          //Check if the channel you checked is a dm
          if(allDMChannels.includes(lastChannelId)){
              const messages = MessageStore.getMessages(lastChannelId)._array
              const lastMsg = messages[messages.length - 1]
              const currentUser = UserStore.getCurrentUser()
            //  console.log(lastMsg);
            //  console.log(currentUser)
  
              if (lastMsg.author.id != currentUser.id){
                  //filter the array so that we replace the previous message of the same user
                  allGhosted = allGhosted.filter(g => g[0] !== lastMsg.author.id)
                  allGhosted.push([lastMsg.author.id, lastMsg.author.username, lastMsg.author.discriminator, ImageResolver.getUserAvatarURL(lastMsg.author), lastMsg.content] )
                  BdApi.saveData('Unghost', 'ghosted', allGhosted) //saving after every message cache
  
               //   console.log('respond to', lastMsg.author.username)
               //   console.log('all ghosted', allGhosted)
                  
                  
              } else { //if you sent the last message, remove the person from ghosted list
                  allGhosted = allGhosted.filter(g => g[0] !== ChannelStore.getChannel(lastChannelId).recipients[0]) 
                  BdApi.saveData('Unghost', 'ghosted', allGhosted)
                 // console.log('all ghosted', allGhosted)
              }
          }
        }
        getSettingsPanel(){
          return this.buildSettingsPanel().getElement();
        }
  
    };
  };
     return plugin(Plugin, Api);
  })(global.ZeresPluginLibrary.buildPlugin(config));
  /*@end@*/