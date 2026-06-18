import Navbar from '../components/Navbar'
import LeftSidebar from '../components/LeftSidebar'
import Feed from '../components/Feed'
import RightSidebar from '../components/RightSidebar'

function Home() {
  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>

      {/* Navbar at the top */}
      <Navbar />

      {/* Main content area */}
      <div style={{ display: 'flex' }}>

        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Feed in the middle */}
        <Feed />

        {/* Right Sidebar */}
        <RightSidebar />

      </div>

    </div>
  )
}

export default Home