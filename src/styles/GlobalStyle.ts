import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  ::-webkit-scrollbar {
    width: 1rem;
  }
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #c5d3e0;
    border-radius: 1.25rem;
    border: 0.375rem solid transparent;
    background-clip: content-box;
  }

  body {
    font-weight: 500;
  }

  img {
    display: block;
  }

  .menu-indicator {
    position: absolute;
    right: -0.5rem;
    width: 1rem;
    height: 3rem;
    background-color: #9fcbf9;
    border-radius: 6px;
    transition: transform 0.3s ease;
    z-index: 1;
  }

  .ant-menu {

    a {
      width: 100%;
      display: block;
    }
  
    .ant-menu-item,
    .ant-menu-submenu {
      font-size: 0.8rem;
      padding: 0;
      position: relative;
    }
  
    .ant-menu-item-icon {
      width: 1.25rem;
    }
  
    .ant-menu-submenu-title {
      color: #ffffff;
      fill: #ffffff;
    }
  
    .ant-menu-submenu-expand-icon,
    .ant-menu-submenu-arrow,
    span[role='img'],
    a,
    .ant-menu-item,
    .ant-menu-submenu {
      color: #ffffff;
      fill: #ffffff;
    }
  
    .ant-menu-item:hover,
    .ant-menu-submenu-title:hover {
      .ant-menu-submenu-expand-icon,
      .ant-menu-submenu-arrow,
      span[role='img'],
      a,
      .ant-menu-item-icon,
      .ant-menu-title-content {
        color: #9fcbf9;
        fill: #9fcbf9;
      }
    }
  
    .ant-menu-submenu-selected .ant-menu-submenu-title {
      color: #9fcbf9;
  
      .ant-menu-submenu-expand-icon,
      .ant-menu-submenu-arrow,
      span[role='img'] {
        color: #9fcbf9;
        fill: #9fcbf9;
      }
    }
  
    .ant-menu-item-selected {
      background-color: transparent !important;
  
      .ant-menu-submenu-expand-icon,
      .ant-menu-submenu-arrow,
      span[role='img'],
      .ant-menu-item-icon,
      a {
        color: #9fcbf9;
        fill: #9fcbf9;
      }
    }
  
    .ant-menu-item-active,
    .ant-menu-submenu-active .ant-menu-submenu-title {
      background-color: transparent !important;
    }
  
    .ant-menu-submenu-arrow {
      margin-right: 1rem;
    }
  }

  .sort-select .ant-select-selector {
    height: 2.5rem;
    white-space: wrap;
    font-size: 0.75rem;
    font-weight: 500;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    border: 1px solid #AEAEAE !important;
  }

  .sort-select .ant-select-selector .ant-select-prefix {
    font-size: 0.75rem;
    font-weight: 400;
    font-family: "Inter", sans-serif;
    color: #AEAEAE !important;
    margin-right: 0.5rem;
  }

  .select-field .ant-select-selector {
    border: 1px solid #E6E6E6 !important;
    background-color: #F5F5F5 !important;
  }

  .select-field .ant-select-arrow {
    color: #000000;
  }

  .ant-layout-has-sider {
    margin-top: 3.5rem;
  }

  .test-conn-btn {
    span,
    svg {
      transition: transform 0.3s ease;
      display: inline-flex;
      align-items: center;
    }

    &:hover,
    &:focus,
    &:active {
      background: #000000 !important;
      color: #FFFFFF !important;
    }

    &:hover span {
      transform: translateX(-4px);
    }

    &:hover svg {
      transform: translateX(4px);
    }
  }

  .view-project-btn {
    span,
    .ant-btn-icon {
      transition: transform 0.3s ease;
      display: inline-flex;
      align-items: center;
    }

    &:hover span {
      transform: translateX(-4px);
    }

    &:hover .ant-btn-icon {
      transform: translateX(4px);
    }
  }

  .ant-radio-button-wrapper::before {
    display: none !important;
  }

  .ant-modal {
    .ant-modal-mask {
      backdrop-filter: blur(6px);
      background-color: rgba(0, 0, 0, 0.3);
    }

    .ant-modal-content {
      padding: 0;
      border-radius: 0.5rem;
    }

    .ant-modal-footer {
      background: #f5f5f5;
      border-radius: 0 0 0.5rem 0.5rem;
      padding: 1rem 2rem;
      display: flex;
      margin-top: 0;
      justify-content: flex-end;
    }
  }

  .details-tabs {
    .ant-tabs-nav .ant-tabs-nav-wrap {
      border-bottom: 1px solid #E6E6E6;
    }
  
    .ant-tabs-nav .ant-tabs-nav-wrap .ant-tabs-nav-list .ant-tabs-tab {
      font-size: 0.75rem;
      font-weight: 400;
      font-family: Inter, sans-serif;
      padding: 0 0 0.3rem;
    }
  
    .ant-tabs-content-holder .ant-tabs-content {
      font-size: 0.75rem;
      font-weight: 300;
      font-family: Inter, sans-serif;
    }
  }

  .react-flow {
    .react-flow__edge.temp {
        stroke: #bbb;
        stroke-dasharray: 5 5;
    }
    .react-flow__nodes {
      .react-flow__node.selected {
        .text-node {
          border: 1px solid #6E6E6E;
        }
        .react-flow__handle {
          visibility: visible;
        }
      }
      .react-flow__node:hover {
        .react-flow__handle {
          visibility: visible;
        }
      }
    }
  }
`;
