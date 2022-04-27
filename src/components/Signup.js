import React from 'react'

const Signup = () => {
  return (
    <div className='container'>
<form>
<div className="mb-3">
    <label htmlFOR="name" className="form-label">Name</label>
    <input type="text" className="form-control" id="name" onChange={onchange} aria-describedby="emailHelp"/>
  </div>
  <div className="mb-3">
    <label htmlFOR="email" className="form-label">Email address</label>
    <input type="email" className="form-control" id="email"  onChange={onchange} aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFOR="password" className="form-label">Password</label>
    <input type="password" className="form-control" id="password" onChange={onchange} />
  </div>
  <div className="mb-3">
    <label htmlFOR="cpassword" className="form-label">Confirm Password</label>
    <input type="password" className="form-control" id="cpassword" onChange={onchange} />
  </div>

  <button type="submit" className="btn btn-primary">Submit</button>
</form>    </div>
  )
}

export default Signup
