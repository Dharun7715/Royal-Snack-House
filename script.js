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
 el("productGrid").innerHTML=visible.length?visible.map(p=>`<article class="product-card"><div class="product-photo"><img loading="lazy" src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" onerror="this.src='https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80'"><span class="product-tag">${escapeHTML(p.tag||p.category)}</span></div><div class="product-info"><span class="product-category">${escapeHTML(p.category)} · ${escapeHTML(p.weight||"")}</span><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.desc||"A delicious snack from our collection.")}</p><div class="product-bottom"><b class="product-price">${money(p.price)}</b><button class="add-button" aria-label="Add ${escapeHTML(p.name)}" data-add="${p.id}">+</button></div></div></article>`).join(""):'<div class="no-products">No snacks found. Try another search.</div>';
 document.querySelectorAll("[data-filter]").forEach(b=>b.classList.toggle("active",b.dataset.filter===activeCategory));
}
function setCategory(category){activeCategory=category;renderProducts();el("shop").scrollIntoView({behavior:"smooth"});}
function addToCart(id){cart[id]=(cart[id]||0)+1;persist();renderCart();toast("Added to your shopping bag");}
function changeQty(id,amount){cart[id]=(cart[id]||0)+amount;if(cart[id]<=0)delete cart[id];persist();renderCart();}
function cartRows(){return Object.entries(cart).map(([id,quantity])=>({product:products.find(p=>p.id===Number(id)),quantity})).filter(row=>row.product);}
function cartTotal(){return cartRows().reduce((sum,row)=>sum+row.product.price*row.quantity,0);}
function renderCart(){
 const rows=cartRows(),count=rows.reduce((sum,row)=>sum+row.quantity,0);
 el("bagCount").textContent=count;el("cartTotal").textContent=money(cartTotal());
 el("cartItems").innerHTML=rows.length?rows.map(({product:p,quantity:q})=>`<div class="cart-line"><img src="${escapeHTML(p.image)}" alt=""><div><h4>${escapeHTML(p.name)}</h4><small>${money(p.price)} each</small><div class="qty-controls"><button data-qty="${p.id}" data-change="-1">−</button><span>${q}</span><button data-qty="${p.id}" data-change="1">+</button></div></div><b>${money(p.price*q)}</b></div>`).join(""):'<div class="empty-cart">Your bag is waiting for something delicious.</div>';
}
function openCart(){el("backdrop").classList.add("show");el("cartDrawer").classList.add("show");}
function closeCart(){el("backdrop").classList.remove("show");el("cartDrawer").classList.remove("show");}
function makeWhatsAppMessage(message){
 if(!STORE.whatsappNumber){navigator.clipboard?.writeText(message).then(()=>toast("Message copied. Add the WhatsApp number in script.js to enable direct ordering.")).catch(()=>toast("Please configure the WhatsApp number in script.js."));return;}
 window.open("https://wa.me/"+STORE.whatsappNumber+"?text="+encodeURIComponent(message),"_blank","noopener");
}
function submitOrder(event){
 event.preventDefault();const rows=cartRows();if(!rows.length)return toast("Your shopping bag is empty");
 const form=new FormData(event.currentTarget),name=String(form.get("customerName")||"").trim(),phone=String(form.get("phone")||"").trim(),address=String(form.get("address")||"").trim(),delivery=form.get("delivery");
 if(delivery==="Delivery"&&!address)return toast("Please enter your delivery address");
 const items=rows.map(r=>r.product.name+" x "+r.quantity+" — "+money(r.product.price*r.quantity)).join("\n");
 const message="Hello Royal Snack House! I'd like to place an order:\n\n"+items+"\n\nTotal: "+money(cartTotal())+"\n\nName: "+name+"\nPhone: "+phone+"\nOrder type: "+delivery+"\nAddress: "+(address||"Store pickup");
 makeWhatsAppMessage(message);
}
function submitContact(event){
 event.preventDefault();const form=new FormData(event.currentTarget);
 const message="Hello Royal Snack House\nName: "+form.get("name")+"\nPhone: "+form.get("phone")+"\nEmail: "+form.get("email")+"\nMessage: "+form.get("message");
 makeWhatsAppMessage(message);event.currentTarget.reset();
}
el("productGrid").addEventListener("click",event=>{const button=event.target.closest("[data-add]");if(button)addToCart(Number(button.dataset.add));});
el("cartItems").addEventListener("click",event=>{const button=event.target.closest("[data-qty]");if(button)changeQty(Number(button.dataset.qty),Number(button.dataset.change));});
document.querySelectorAll("[data-filter]").forEach(button=>button.addEventListener("click",()=>setCategory(button.dataset.filter)));
document.querySelectorAll("[data-category]").forEach(button=>button.addEventListener("click",()=>setCategory(button.dataset.category)));
el("searchInput").addEventListener("input",renderProducts);
el("bagButton").addEventListener("click",openCart);el("closeCart").addEventListener("click",closeCart);el("backdrop").addEventListener("click",closeCart);
el("checkoutForm").addEventListener("submit",submitOrder);el("contactForm").addEventListener("submit",submitContact);
el("menuToggle").addEventListener("click",()=>el("navLinks").classList.toggle("open"));
document.querySelectorAll("#navLinks a").forEach(a=>a.addEventListener("click",()=>el("navLinks").classList.remove("open")));
el("year").textContent=new Date().getFullYear();renderProducts();renderCart();
