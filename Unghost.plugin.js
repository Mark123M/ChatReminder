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
          note: "Enter a positive integer to set the time interval (in minutes) between each reminder. Any other input will reset the interval to 15 min",
          value: 15
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
    let reminderModal = null
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
            reminderModal =  setInterval(()=>{
             /* const display = allGhosted.map(g=>{document.createElement(
                  `<div style = "width: 200px; height: 40px; color: white;">
                      ${g[1]}
                   </div>
                  `)
              }) */
              console.log(allGhosted)
              
              const listHTML = BdApi.DOM.parseHTML(
              `<div class = "reminderList" style = "color: #b9bbbe; font-family: Whitney,Helvetica Neue,Helvetica,Arial,sans-serif;">
                  ${allGhosted.map(g =>
                      `<div class = "reminderListItem" style = "display: flex; align-items: center; margin-top: 10px; margin-left: 5px;"> 
                          <img src = ${g[3]} style = "border-radius: 50%; height: 60px; width: 60px "> 
                          <span style= "margin-left: 12px;" > 
                              <div class = "listItemInfo">
                                  <div class = "listItemUser" style = "font-weight: 700; color: #f8f8f9;"> ${g[1] + " #" + g[2]} </div>
                                  <div class = "listItemMsg" style = "margin-top: 5px;"> ${g[4]}</div>
                              </div>
                          </span>
                      </div>`
                  ).join("")}
              </div>`)
              console.log(listHTML)
              console.log(parseInt(this.settings.reminderInterval))
  
              // const testHTML = BdApi.DOM.parseHTML( `<div class = "reminderList" style = "color: ;"> hello </div>`)
  
            //  BdApi.UI.alert("Remember to respond!", BdApi.React.createElement(BdApi.ReactUtils.wrapElement(listHTML)))
  
            }, Number.isInteger(parseInt(this.settings.reminderInterval)) && parseInt(this.settings.reminderInterval) > 0
            ? parseInt(this.settings.reminderInterval) : 15*60000)
        }
  
        onStop() {
            BdApi.saveData('Unghost', 'ghosted', allGhosted)
            clearInterval(reminderModal)
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
          if(ChannelStore.getChannel(lastChannelId).name === ""){
              const messages = MessageStore.getMessages(lastChannelId)._array
              const lastMsg = messages[messages.length - 1]
              const currentUser = UserStore.getCurrentUser()
            
              console.log(lastMsg.author, 'sdsuofnsduifuisdhfuihsduifhuisdhfuisd');
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
  
  
        patchRoleMention() {
            const Pill = Webpack.getModule(m => m?.toString().includes("iconMentionText"), {defaultExport: false});
            Patcher.before(this.name, Pill, "Z", (_, [props]) => {
                if (!props?.className.toLowerCase().includes("rolemention")) return;
                props.className += ` interactive`;
                props.onClick = (e) => {
                    const roles = GuildStore.getGuild(SelectedGuildStore.getGuildId()).roles;
                    const name = props.children[1][0].slice(1);
                    let role = filter(roles, r => r.name == name);
                    if (!role) return;
                    role = role[Object.keys(role)[0]];
                    this.showRolePopout(e.nativeEvent.target, SelectedGuildStore.getGuildId(), role.id);
                };
            });
        }
  
        patchGuildContextMenu() {
            this.contextMenuPatch = ContextMenu.patch("guild-context", (retVal, props) => {
                const guild = props.guild;
                const guildId = guild.id;
                const roles = guild.roles;
                const roleItems = [];
  
                for (const roleId in roles) {
                    const role = roles[roleId];
                    const item = ContextMenu.buildItem({
                        id: roleId,
                        label: role.name,
                        style: {color: role.colorString ? role.colorString : ""},
                        closeOnClick: false,
                        action: (e) => {
                            if (e.ctrlKey) {
                                try {
                                    DiscordNative.clipboard.copy(role.id);
                                    UI.showToast("Copied Role ID to clipboard!", {type: "success"});
                                }
                                catch {
                                    UI.showToast("Could not copy Role ID to clipboard", {type: "success"});
                                }
                            }
                            else {
                                this.showRolePopout({
                                    getBoundingClientRect() {
                                        return {
                                            top: e.pageY,
                                            bottom: e.pageY,
                                            left: e.pageX,
                                            right: e.pageX
                                        };
                                    }
                                }, guildId, role.id);
                            }
                        }
                    });
                    roleItems.push(item);
                }
  
                const newOne = ContextMenu.buildItem({type: "submenu", label: "Role Members", children: roleItems});
  
                const separatorIndex = retVal.props.children.findIndex(k => !k?.props?.label);
                const insertIndex = separatorIndex > 0 ? separatorIndex + 1 : 1;
                retVal.props.children.splice(insertIndex, 0, newOne);
                // return original;
  
            });
        }
  
        showRolePopout(target, guildId, roleId) {
            const roles = GuildStore.getGuild(guildId).roles;
            const role = roles[roleId];
            let members = GuildMemberStore.getMembers(guildId);
            if (guildId != roleId) members = members.filter(m => m.roles.includes(role.id));
  
            const popout = DOM.parseHTML(Utilities.formatString(popoutHTML, {memberCount: members.length}));
            const searchInput = popout.querySelector("input");
            searchInput.addEventListener("keyup", () => {
                const items = popout.querySelectorAll(".role-member");
                for (let i = 0, len = items.length; i < len; i++) {
                    const search = searchInput.value.toLowerCase();
                    const item = items[i];
                    const username = item.querySelector(".username").textContent.toLowerCase();
                    if (!username.includes(search)) item.style.display = "none";
                    else item.style.display = "";
                }
            });
  
            const scroller = popout.querySelector(".role-members");
            for (const member of members) {
                const user = UserStore.getUser(member.userId);
                const elem = DOM.parseHTML(Utilities.formatString(itemHTML, {username: Utils.escapeHTML(user.username), discriminator: "#" + user.discriminator, avatar_url: ImageResolver.getUserAvatarURL(user)}));
                elem.addEventListener("click", () => {
                    // UI.showToast("User popouts are currently broken!", {type: "error"});
                    setTimeout(() => Popouts.showUserPopout(elem, user, {guild: guildId}), 1);
                });
                scroller.append(elem);
            }
  
            this.showPopout(popout, target);
            searchInput.focus();
        }
  
        showPopout(popout, relativeTarget) {
            if (this.listener) this.listener({target: {classList: {contains: () => {}}, closest: () => {}}}); // Close any previous popouts
            
            document.querySelector(`[class*="app-"] ~ ${DiscordSelectors.TooltipLayers.layerContainer}`).append(popout);
  
            const maxWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            const maxHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  
            const offset = relativeTarget.getBoundingClientRect();
            if (offset.right + popout.offsetHeight >= maxWidth) {
                // popout.classList.add(...DiscordClasses.Popouts.popoutLeft.value.split(" "));
                popout.style.left = Math.round(offset.left - popout.offsetWidth - 20) + "px";
                // popout.animate({left: Math.round(offset.left - popout.offsetWidth - 10)}, 100);
                const original = Math.round(offset.left - popout.offsetWidth - 20);
                const endPoint = Math.round(offset.left - popout.offsetWidth - 10);
                DOM.animate(function(progress) {
                        let value = 0;
                        if (endPoint > original) value = original + (progress * (endPoint - original));
                        else value = original - (progress * (original - endPoint));
                        popout.style.left = value + "px";
                }, 100);
            }
            else {
                // popout.classList.add(...DiscordClasses.Popouts.popoutRight.value.split(" "));
                popout.style.left = (offset.right + 10) + "px";
                // popout.animate({left: offset.right}, 100);
                const original = offset.right + 10;
                const endPoint = offset.right;
                DOM.animate(function(progress) {
                        let value = 0;
                        if (endPoint > original) value = original + (progress * (endPoint - original));
                        else value = original - (progress * (original - endPoint));
                        popout.style.left = value + "px";
                }, 100);
            }
  
            if (offset.top + popout.offsetHeight >= maxHeight) popout.style.top = Math.round(maxHeight - popout.offsetHeight) + "px";
            else popout.style.top = offset.top + "px";
  
            this.listener = (e) => {
                const target = e.target;
                if (!target.classList.contains("popout-role-members") && !target.closest(".popout-role-members")) {
                    popout.remove();
                    document.removeEventListener("click", this.listener);
                    delete this.listener;
                }
            };
            setTimeout(() => document.addEventListener("click", this.listener), 500);
        }
  
    };
  };
     return plugin(Plugin, Api);
  })(global.ZeresPluginLibrary.buildPlugin(config));
  /*@end@*/