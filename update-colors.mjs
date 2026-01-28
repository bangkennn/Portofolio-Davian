/**
 * Script untuk mengupdate warna gradient Instagram dan LinkedIn
 * Jalankan dengan: node update-colors.mjs
 */

const API_URL = 'http://localhost:3000/api/contact-links';

async function getContactLinks() {
  const response = await fetch(API_URL);
  const result = await response.json();
  return result.data || [];
}

async function updateContactLink(id, updates) {
  const response = await fetch(API_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, ...updates }),
  });
  return response.json();
}

async function main() {
  try {
    console.log('🔍 Mengambil data contact links...');
    const links = await getContactLinks();
    
    console.log(`\n📊 Ditemukan ${links.length} contact links\n`);
    
    // Update Instagram card
    const instagramCard = links.find(link => 
      link.title && link.title.includes('Perjalanan') || 
      (link.url && link.url.includes('instagram'))
    );
    
    if (instagramCard) {
      console.log('📸 Updating Instagram card...');
      console.log(`   Judul: ${instagramCard.title}`);
      const result = await updateContactLink(instagramCard.id, {
        gradient: 'from-pink-500 via-purple-500 to-orange-400',
        bg_color: 'bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-orange-400/10'
      });
      console.log('   ✅ Instagram card updated!');
      console.log(`   Gradient: from-pink-500 via-purple-500 to-orange-400\n`);
    } else {
      console.log('❌ Instagram card tidak ditemukan\n');
    }
    
    // Update LinkedIn card
    const linkedinCard = links.find(link => 
      link.title && link.title.includes('Terhubung') || 
      (link.url && link.url.includes('linkedin'))
    );
    
    if (linkedinCard) {
      console.log('💼 Updating LinkedIn card...');
      console.log(`   Judul: ${linkedinCard.title}`);
      const result = await updateContactLink(linkedinCard.id, {
        gradient: 'from-blue-600 via-blue-500 to-blue-400',
        bg_color: 'bg-gradient-to-br from-blue-600/10 via-blue-500/10 to-blue-400/10'
      });
      console.log('   ✅ LinkedIn card updated!');
      console.log(`   Gradient: from-blue-600 via-blue-500 to-blue-400\n`);
    } else {
      console.log('❌ LinkedIn card tidak ditemukan\n');
    }
    
    console.log('🎉 Update selesai! Refresh halaman contact untuk melihat perubahan.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
