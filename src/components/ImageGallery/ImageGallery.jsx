import React, { Component } from 'react';
import { ImageGalleryList, InputMessageForm } from './ImageGallery.styled';
import ImageGalleryItem from 'components/ImageGalleryItem';
import LoadMoreBtn from 'components/Button';
// import { toast } from 'react-toastify';
import ImageErrorView from './ImageErrorView/ImageErrorView';
import LoaderView from 'components/Loader/Loader';

class ImageGallery extends Component {
  state = {
    images: [],
    // loading: false,
    error: null,
    status: 'idle',
    page: 1,
  };

  componentDidUpdate(prevProps, prevState) {
    const prevName = prevProps.imageName;
    const newName = this.props.imageName;
    const prevPage = prevState.page;
    const newPage = this.state.page;
    const MY_KEY = '30279426-ce0edf6a31bb607e668c5bb01';

    if (prevName !== newName || prevPage !== newPage) {
      this.setState({ status: 'pending' });

      // setTimeout(() => {
      // }, 2000)

      fetch(
        `https://pixabay.com/api/?q=${newName}&page=1&key=${MY_KEY}&image_type=photo&orientation=horizontal&per_page=12&page=${newPage}`
      )
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          return Promise.reject(new Error(`${newName} not found. Try again!`));
        })
        .then(images => this.setState(prevState => ({ images: [...prevState.images, ...images.hits], status: 'resolved' })))
        .catch(error => this.setState({ error, status: 'rejected' }));
    }
  }

  loadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  render() {
    const { images, error, status } = this.state;
    const { imageName } = this.props;
    // console.log(images);

    if (status === 'idle') {
      return <InputMessageForm>Input image or photo name</InputMessageForm>;
    }

    if (status === 'pending') {
      return <LoaderView message={`Loading ${imageName}`} />;
    }

    if (status === 'rejected') {
      return <ImageErrorView message={error.message} />;
    }

    if (images && images.total === 0) {
      // toast.error('Please try again!');
      // return <h2>{imageName} not found. Please try again!</h2>;
      return (
        <ImageErrorView message={`${imageName} not found. Please try again!`} />
      );
    }

    if (status === 'resolved') {
      return (
        <>
          <ImageGalleryList>
            <ImageGalleryItem imageList={images} />
          </ImageGalleryList>
          <LoadMoreBtn onClick={this.loadMore} />
        </>
      );
    }

    // return (
    //   <>
    //     <ImageGalleryList>
    //       {/* <!-- Набор <li> с изображениями --> */}
    //       {!imageName && <h2>Input image or photo name</h2>}
    //       {error && <h2>{error.message} </h2>}
    //       {loading && <h3>Loading {imageName}</h3>}
    //       {image && <ImageGalleryItem imageList={image} />}
    //     </ImageGalleryList>
    //     {imageName && <LoadMoreBtn />}
    //   </>
    // );
  }
}

export default ImageGallery;
