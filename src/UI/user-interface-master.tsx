import { Link } from "react-router-dom"
import "../styles/user-interface-master.css"
export const UImaster = () => {
    return (
        <div className="UI-master">

        
        <div className="menu">
      <nav>
        <ul>
          <li><a href="#"><Link to="/sectora" className="ui-main-link">SECTOR-A</Link></a></li>
          <li><a href="#">menu</a></li>
          <li><a href="#">menu</a></li>
          <li><a href="#">menu</a>
            <ul className="sub1">
              <li><a href="#">menu</a></li>
              <li><a href="#">menu</a></li>
              <li><a href="#">menu</a></li>
              <li><a href="#">menu</a></li>
            </ul>
          </li>
          <li><a href="#">menu</a>
            <ul className="sub1">
              <li><a href="#">menu</a></li>
              <li><a href="#">menu</a></li>
              <li><a href="#">menu</a></li>
              <li><a href="#">menu</a>
                <ul className="sub2">
                  <li><a href="#">menu</a></li>
                  <li><a href="#">menu</a></li>
                  <li><a href="#">menu</a></li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
        </div>
    )
}


