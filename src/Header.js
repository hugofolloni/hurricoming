const Header = () => {
    return (
        <div className="header-div">
            <h1 style={{cursor: 'pointer'}} onClick={() => window.location.href = "/"}>hurricoming</h1>
            <a href="/notify">Notify me</a>
        </div>
     );
}
 
export default Header;