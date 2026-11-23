// Royal Snack House storefront interactions
// Add the business WhatsApp number with country code (digits only) before launch.
const STORE = { whatsappNumber: "", currency: "₹" };
const starterProducts = [
{id:1,name:"Classic Mixture",category:"Traditional",price:120,weight:"250 g",tag:"Bestseller",desc:"A satisfying blend of savoury crunchy bites.",image:"https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85"},
{id:2,name:"Crispy Murukku",category:"Traditional",price:100,weight:"200 g",tag:"Classic",desc:"A timeless crunchy snack for every occasion.",image:"https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=900&q=85"},
{id:3,name:"Masala Crunch",category:"Spicy",price:140,weight:"250 g",tag:"Spicy pick",desc:"A bold, flavour-packed snack with a kick.",image:"https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=900&q=85"},
{id:4,name:"Golden Thattai",category:"Crunchy",price:110,weight:"200 g",tag:"Customer favourite",desc:"Light, crisp and wonderfully moreish.",image:"https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=85"},
{id:5,name:"Royal Snack Box",category:"Combos",price:299,weight:"Assorted",tag:"Great for sharing",desc:"A handpicked assortment for sharing moments.",image:"https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=900&q=85"},
{id:6,name:"Spicy Ribbon Pakoda",category:"Spicy",price:130,weight:"250 g",tag:"Popular",desc:"A crunchy ribbon with a delicious spicy finish.",image:"https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=85"},
{id:7,name:"Pepper Sev",category:"Crunchy",price:115,weight:"200 g",tag:"Crunchy",desc:"Fine, crisp strands with peppery flavour.",image:"https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=900&q=85"},
{id:8,name:"Family Snack Combo",category:"Combos",price:499,weight:"Assorted",tag:"Family pick",desc:"A generous selection for family snack time.",image:"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85"}
];
const money = n => STORE.currency + Number(n).toFixed(0);
const safeRead = (key,fallback) => { try { const v=JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; } };
let products = safeRead("rhs_products",starterProducts);
let cart = safeRead("rhs_cart",{});
let activeCategory = "All";
const el = id => document.getElementById(id);
const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function persist(){localStorage.setItem("rhs_products",JSON.stringify(products));localStorage.setItem("rhs_cart",JSON.stringify(cart));}
function toast(message){const node=el("toast");node.textContent=message;node.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>node.classList.remove("show"),2800);}
function renderProducts(){
 const query=(el("searchInput").value||"").trim().toLowerCase();
 const visible=products.filter(p=>(activeCategory==="All"||p.category===activeCategory)&&[p.name,p.category,p.desc].join(" ").toLowerCase().includes(query));
 el("productGrid").innerHTML=visible.length?visible.map(p=>`<article class="product-card" data-product-card="${p.id}"><div class="product-photo"><img loading="lazy" src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" onerror="this.src='https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80'"><span class="product-tag">${escapeHTML(p.tag||p.category)}</span></div><div class="product-info"><span class="product-category">${escapeHTML(p.category)} · ${escapeHTML(p.weight||"")}</span><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.desc||"A delicious snack from our collection.")}</p><div class="product-bottom"><b class="product-price">${money(p.price)}</b><button class="add-button" aria-label="Add ${escapeHTML(p.name)}" data-add="${p.id}">+</button></div></div></article>`).join(""):'<div class="no-products">No snacks found. Try another search.</div>';
 document.querySelectorAll("[data-filter]").forEach(b=>b.classList.toggle("active",b.dataset.filter===activeCategory));
}
function setCategory(category){activeCategory=category;renderProducts();el("shop").scrollIntoView({behavior:"smooth"});}
function addToCart(id){cart[id]=(cart[id]||0)+1;persist();renderCart();toast("Added to your shopping bag");}
function changeQty(id,amount){cart[id]=(cart[id]||0)+amount;if(cart[id]<=0)delete cart[id];persist();renderCart();}
function cartRows(){return Object.entries(cart).map(([id,quantity])=>({product:products.find(p=>p.id===Number(id)),quantity})).filter(row=>row.product);}
function cartTotal(){return cartRows().reduce((sum,row)=>sum+row.product.price*row.quantity,0);}
function estimatedDeliveryCharge(subtotal){return subtotal>=500||subtotal===0?0:40;}
function renderCart(){
 const rows=cartRows(),count=rows.reduce((sum,row)=>sum+row.quantity,0);
 el("bagCount").textContent=count;const subtotal=cartTotal(),charge=estimatedDeliveryCharge(subtotal);el("cartTotal").textContent=money(subtotal+charge);const deliveryNote=el("deliveryEstimate");if(deliveryNote)deliveryNote.textContent=subtotal===0?"Delivery: ₹40 below ₹500 · Free from ₹500":"Items "+money(subtotal)+" · Delivery "+(charge===0?"FREE":money(charge))+" · Estimated 2–3 days";
 el("cartItems").innerHTML=rows.length?rows.map(({product:p,quantity:q})=>`<div class="cart-line"><img src="${escapeHTML(p.image)}" alt=""><div><h4>${escapeHTML(p.name)}</h4><small>${money(p.price)} each</small><div class="qty-controls"><button data-qty="${p.id}" data-change="-1">−</button><span>${q}</span><button data-qty="${p.id}" data-change="1">+</button></div></div><b>${money(p.price*q)}</b></div>`).join(""):'<div class="empty-cart">Your bag is waiting for something delicious.</div>';
}
function openCart(){el("backdrop").classList.add("show");el("cartDrawer").classList.add("show");}
function closeCart(){el("backdrop").classList.remove("show");el("cartDrawer").classList.remove("show");}
function makeWhatsAppMessage(message){
 if(!STORE.whatsappNumber){navigator.clipboard?.writeText(message).then(()=>toast("Message copied. Add the WhatsApp number in script.js to enable direct ordering.")).catch(()=>toast("Please configure the WhatsApp number in script.js."));return;}
 window.open("https://wa.me/"+STORE.whatsappNumber+"?text="+encodeURIComponent(message),"_blank","noopener");
}
async function submitOrder(event){
 event.preventDefault();const formElement=event.currentTarget;const rows=cartRows();if(!rows.length)return toast("Your shopping bag is empty");
 const form=new FormData(event.currentTarget),name=String(form.get("customerName")||"").trim(),phone=String(form.get("phone")||"").trim(),address=String(form.get("address")||"").trim(),delivery="Delivery";
 if(delivery==="Delivery"&&!address)return toast("Please enter your delivery address");
 const items=rows.map(r=>r.product.name+" x "+r.quantity+" — "+money(r.product.price*r.quantity)).join("\n");
 const button=event.submitter;button.disabled=true;button.textContent="Placing order…";
 try{
  const payload=rows.map(r=>({product_id:Number(r.product.id),quantity:r.quantity}));
  const {data,error}=await authClient.rpc("create_store_order",{p_customer_name:name,p_phone:phone,p_delivery_address:address,p_delivery_type:delivery,p_items:payload,p_coupon_code:String(form.get("couponCode")||"").trim()||null,p_notes:null});
  if(error)throw error;
  cart={};persist();renderCart();formElement.reset();closeCart();
  toast("Order "+data.order_number+" placed successfully! We'll contact you shortly.");
  const receipt="Hello Royal Snack House! My order "+data.order_number+" has been placed. Items: "+money(data.subtotal-data.discount)+". Delivery: "+money(data.delivery_charge||0)+". Total: "+money(data.total)+". Name: "+name+". Phone: "+phone+".";
  if(STORE.whatsappNumber)window.open("https://wa.me/"+STORE.whatsappNumber+"?text="+encodeURIComponent(receipt),"_blank","noopener");
 }catch(error){toast(error.message||"Unable to place order. Please try again.");}
 finally{button.disabled=false;button.textContent="Place order ↗";}
}
function submitContact(event){
 event.preventDefault();const form=new FormData(event.currentTarget);
 const message="Hello Royal Snack House\nName: "+form.get("name")+"\nPhone: "+form.get("phone")+"\nEmail: "+form.get("email")+"\nMessage: "+form.get("message");
 makeWhatsAppMessage(message);event.currentTarget.reset();
}
el("productGrid").addEventListener("click",event=>{const button=event.target.closest("[data-add]");if(button)addToCart(Number(button.dataset.add));});
el("productGrid").addEventListener("click",async event=>{const card=event.target.closest("[data-product-card]");if(!card)return;try{const {data:{user}}=await authClient.auth.getUser();if(!user)return;const productId=Number(card.dataset.productCard);await authClient.from("customer_recently_viewed").upsert({user_id:user.id,product_id:productId,viewed_at:new Date().toISOString()},{onConflict:"user_id,product_id"});}catch(error){console.debug("Recently viewed tracking unavailable",error);}});
el("cartItems").addEventListener("click",event=>{const button=event.target.closest("[data-qty]");if(button)changeQty(Number(button.dataset.qty),Number(button.dataset.change));});
document.querySelectorAll("[data-filter]").forEach(button=>button.addEventListener("click",()=>setCategory(button.dataset.filter)));
document.querySelectorAll("[data-category]").forEach(button=>button.addEventListener("click",()=>setCategory(button.dataset.category)));
el("searchInput").addEventListener("input",renderProducts);
el("bagButton").addEventListener("click",openCart);el("closeCart").addEventListener("click",closeCart);el("backdrop").addEventListener("click",closeCart);
el("checkoutForm").addEventListener("submit",submitOrder);const contactForm=el("contactForm");if(contactForm)contactForm.addEventListener("submit",submitContact);
el("menuToggle").addEventListener("click",()=>el("navLinks").classList.toggle("open"));
document.querySelectorAll("#navLinks a").forEach(a=>a.addEventListener("click",()=>el("navLinks").classList.remove("open")));
el("year").textContent=new Date().getFullYear();renderProducts();renderCart();

// Shared authentication: owners/staff enter admin, customers enter their account.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";
const authClient=createClient("https://ubwdtuggqftzzdkdlzpj.supabase.co","sb_publishable_LtOda0MxMFrN_laGRH67LA_FcQn6v7h",{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storage:window.localStorage}});
const loginOverlay=document.getElementById("loginOverlay");

async function loadLiveProducts(){
 try{
  const {data,error}=await authClient.from("products").select("id,name,category,description,price,weight,image_url,tag,is_active,stock_quantity").eq("is_active",true).order("id");
  if(error)throw error;
  if(data?.length){products=data.map(p=>({id:p.id,name:p.name,category:p.category,price:Number(p.price),weight:p.weight||"",tag:p.tag||p.category,desc:p.description||"",image:p.image_url||"",stock_quantity:p.stock_quantity}));localStorage.setItem("rhs_products",JSON.stringify(products));renderProducts();renderCart();}
 }catch(error){console.warn("Live product catalogue unavailable; showing cached catalogue.",error);}
}

let authMode="signin";
let currentAuthSession=null;
const loginButton=document.getElementById("loginButton");
const signupButton=document.getElementById("signupButton");
const logoutButton=document.createElement("button");
logoutButton.type="button";logoutButton.className="nav-btn";logoutButton.id="customerLogoutButton";logoutButton.textContent="Log out";logoutButton.hidden=true;
signupButton.insertAdjacentElement("afterend",logoutButton);
function updateAuthUI(session){
 currentAuthSession=session||null;
 loginButton.textContent=session?"My account":"Login";
 signupButton.hidden=!!session;
 logoutButton.hidden=!session;
}
loginButton.addEventListener("click",()=>{
 if(currentAuthSession){window.location.href="customer.html";return;}
 setAuthMode("signin");loginOverlay.classList.add("open");loginOverlay.setAttribute("aria-hidden","false");
});
logoutButton.addEventListener("click",async()=>{
 logoutButton.disabled=true;
 const {error}=await authClient.auth.signOut();
 logoutButton.disabled=false;
 if(error){toast(error.message);return;}
 updateAuthUI(null);toast("You have been signed out.");
 window.location.href="index.html";
});
loadLiveProducts();
async function syncAuthSession(){
 try{
  const {data,error}=await authClient.auth.getSession();
  if(error)throw error;
  updateAuthUI(data.session);
 }catch(error){
  console.warn("Could not sync saved session:",error);
 }
}
// Restore the correct signed-in state when returning to a page kept in
// the browser's back-forward cache, or when switching back to this tab.
authClient.auth.getSession().then(({data,error})=>{
 if(error){console.warn("Could not restore saved session:",error);return;}
 updateAuthUI(data.session);
});
window.addEventListener("pageshow",()=>syncAuthSession());
document.addEventListener("visibilitychange",()=>{
 if(document.visibilityState==="visible")syncAuthSession();
});
authClient.auth.onAuthStateChange((_event,session)=>updateAuthUI(session));
function authMessage(message,isError=false){const node=document.getElementById("storeLoginError");node.textContent=message;node.style.color=isError?"#a12b2b":"#276344";}
function setAuthMode(mode){
 authMode=mode;const signup=mode==="signup";
 document.getElementById("authHeading").textContent=signup?"Create your account.":"Welcome back.";
 document.getElementById("authSubheading").textContent=signup?"Join the Royal Snack House family.":"Sign in to continue.";
 document.getElementById("authNameWrap").hidden=!signup;
 document.getElementById("storeLoginName").required=signup;
 document.getElementById("storeLoginSubmit").textContent=signup?"Create account ↗":"Sign in ↗";
 document.getElementById("forgotPassword").hidden=signup;
 document.getElementById("showSignIn").classList.toggle("active",!signup);
 document.getElementById("showSignUp").classList.toggle("active",signup);
 document.getElementById("storeLoginPassword").autocomplete=signup?"new-password":"current-password";
 authMessage("");
}
function closeStoreLogin(){loginOverlay.classList.remove("open");loginOverlay.setAttribute("aria-hidden","true");authMessage("");}
document.getElementById("signupButton").addEventListener("click",()=>{setAuthMode("signup");loginOverlay.classList.add("open");loginOverlay.setAttribute("aria-hidden","false");});
document.getElementById("closeLogin").addEventListener("click",closeStoreLogin);
loginOverlay.addEventListener("click",e=>{if(e.target===loginOverlay)closeStoreLogin();});
document.getElementById("showSignIn").addEventListener("click",()=>setAuthMode("signin"));
document.getElementById("showSignUp").addEventListener("click",()=>setAuthMode("signup"));
document.getElementById("forgotPassword").addEventListener("click",async()=>{
 const email=document.getElementById("storeLoginEmail").value.trim();
 if(!email)return authMessage("Enter your email address first.",true);
 const {error}=await authClient.auth.resetPasswordForEmail(email,{redirectTo:"https://royalsnackhouse.onrender.com/customer.html"});
 authMessage(error?error.message:"If this email has an account, a password reset link will be sent. Check your inbox.");
});
document.getElementById("storeLoginForm").addEventListener("submit",async e=>{
 e.preventDefault();const btn=document.getElementById("storeLoginSubmit");btn.disabled=true;authMessage(authMode==="signup"?"Creating your account…":"Signing in…");
 const email=document.getElementById("storeLoginEmail").value.trim().toLowerCase(),password=document.getElementById("storeLoginPassword").value;
 try{
  if(authMode==="signup"){
   const fullName=document.getElementById("storeLoginName").value.trim();
   if(!fullName)throw new Error("Please enter your name.");
   const {data,error}=await authClient.auth.signUp({email,password,options:{data:{full_name:fullName,display_name:fullName},emailRedirectTo:"https://royalsnackhouse.onrender.com/customer.html"}});
   if(error)throw error;
   if(data.session){location.href="index.html#shop";return;}
   authMessage("Account created. Please check your email and confirm your address before signing in.");
   return;
  }
  const signInResult=await Promise.race([authClient.auth.signInWithPassword({email,password}),new Promise((_,reject)=>setTimeout(()=>reject(new Error("Sign-in is taking too long. Check your internet connection and try again.")),12000))]);const {data,error}=signInResult;if(error)throw error;
  // A successful Supabase sign-in is enough to enter the shop.
  // Only a confirmed active owner/staff profile should be routed to admin.
  let isAdmin=false;
  try{
   const controller=new AbortController();
   const timeout=setTimeout(()=>controller.abort(),5000);
   const response=await fetch("https://ubwdtuggqftzzdkdlzpj.supabase.co/functions/v1/admin-api",{
    method:"POST",
    headers:{"Content-Type":"application/json","apikey":"sb_publishable_LtOda0MxMFrN_laGRH67LA_FcQn6v7h","Authorization":"Bearer "+data.session.access_token},
    body:JSON.stringify({action:"overview"}),
    signal:controller.signal
   });
   clearTimeout(timeout);
   const result=await response.json().catch(()=>({}));
   isAdmin=response.ok&&result.profile&&result.profile.is_active!==false&&(result.profile.role==="owner"||result.profile.role==="staff");
  }catch(checkError){
   console.warn("Admin profile check unavailable; continuing to shop.",checkError);
  }
  closeStoreLogin();updateAuthUI(data.session);const destination=isAdmin?new URL("admin.html",window.location.href).href:new URL("index.html#home",window.location.href).href;window.location.assign(destination);
  return;
 }catch(error){authMessage(error.message||"Unable to continue.",true);}
 finally{btn.disabled=false;}
});
