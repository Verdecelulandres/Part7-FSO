import { useState, useImperativeHandle } from 'react';

const Togglable = (props) => {

  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => { setVisible(!visible) };

  useImperativeHandle(props.ref, () => {
    return { toggleVisibility }
  });

  return (
    <div>
      {!visible &&
        <button onClick={toggleVisibility}>
          {props.btnLabel}
        </button>
      }
      {visible &&
        <div>
          {props.children}
          <button onClick={toggleVisibility}>
            cancel
          </button>
        </div>
      }
    </div>
  );
}

export default Togglable;